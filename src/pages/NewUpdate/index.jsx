import React, { useEffect, useState } from "react";
import { IoCamera } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

export const NewUpdate = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState(""); // 'individual', 'legal', or 'entrepreneur'
  const [allowedTab, setAllowedTab] = useState("");
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roleLabels = {
    individual: "Fiziki şəxs",
    legal: "Hüquqi şəxs",
    entrepreneur: "Sahibkar",
  };
  
  // API data states
  const [truckTypes, setTruckTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  // Derive allowed tab from user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!token) {
          // Default to individual if not authenticated; adjust if route is protected elsewhere
          setAllowedTab("individual");
          setActiveTab("individual");
          return;
        }
        const res = await axios.get("https://atfplatform.tw1.ru/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const role = res?.data?.data?.role;
        const map = {
          individual: "individual",
          legal_entity: "legal",
          entrepreneur: "entrepreneur",
        };
        const tab = map[role] || "individual";
        setAllowedTab(tab);
        setActiveTab(tab);
      } catch (e) {
        setAllowedTab("individual");
        setActiveTab("individual");
      } finally {
        setIsRoleLoading(false);
      }
    };
    fetchUserRole();
  }, [token]);

  // Fetch API data for dropdowns
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setIsDataLoading(true);
        const [truckTypesRes, unitsRes, areasRes] = await Promise.all([
          axios.get("https://atfplatform.tw1.ru/api/truck-types", {
            headers: { 
              Authorization: `Bearer ${token}`, 
              Accept: 'application/json' 
            }
          }),
          axios.get("https://atfplatform.tw1.ru/api/units", {
            headers: { 
              Authorization: `Bearer ${token}`, 
              Accept: 'application/json' 
            }
          }),
          axios.get("https://atfplatform.tw1.ru/api/areas", {
            headers: { 
              Authorization: `Bearer ${token}`, 
              Accept: 'application/json' 
            }
          })
        ]);
        
        setTruckTypes(truckTypesRes.data.data || []);
        setUnits(unitsRes.data.data || []);
        setAreas(areasRes.data.data || []);

        console.log("Fetched Truck Types:", truckTypesRes.data.data);
        console.log("Fetched Units:", unitsRes.data.data);
        console.log("Fetched Areas:", areasRes.data.data);
        console.log("Truck Types length:", truckTypesRes.data.data?.length);
        console.log("Units length:", unitsRes.data.data?.length);
        console.log("Areas length:", areasRes.data.data?.length);
      } catch (error) {
        console.error("Error fetching API data:", error);
        // Set empty arrays on error
        setTruckTypes([]);
        setUnits([]);
        setAreas([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchApiData();
  }, [token]);

  // Debug state variables
  useEffect(() => {
    console.log("Current truckTypes state:", truckTypes);
    console.log("Current units state:", units);
    console.log("Current areas state:", areas);
  }, [truckTypes, units, areas]);

  // Local language tab state for form fields (az, ru, en)
  const [activeLangTab, setActiveLangTab] = useState('az');

  // Individual (Fiziki şəxs) form state
  const [individualFormData, setIndividualFormData] = useState({
    capacity: "",
    unit_id: "",
    reach_from_address: "",
    photos: [],
    empty_space: "",
    truck_type_id: "",
    truck_registration_number: "",
    from_id: "",
    to_id: "",
    expires_at: "",
    name_az: "",
    name_ru: "",
    name_en: "",
    load_type_az: "",
    load_type_ru: "",
    load_type_en: "",
    exit_from_address_az: "",
    exit_from_address_ru: "",
    exit_from_address_en: "",
    description_az: "",
    description_ru: "",
    description_en: "",
  });

  // Legal (Hüquqi şəxs) form state
  const [legalFormData, setLegalFormData] = useState({
    driver_certificates: [],
    driver_photo: null,
    capacity: "",
    unit_id: "",
    reach_from_address: "",
    photos: [],
    empty_space: "",
    truck_type_id: "",
    truck_registration_number: "",
    from_id: "",
    to_id: "",
    expires_at: "",
    driver_full_name_az: "",
    driver_full_name_ru: "",
    driver_full_name_en: "",
    driver_biography_az: "",
    driver_biography_ru: "",
    driver_biography_en: "",
    driver_experience_az: "",
    driver_experience_ru: "",
    driver_experience_en: "",
    name_az: "",
    name_ru: "",
    name_en: "",
    load_type_az: "",
    load_type_ru: "",
    load_type_en: "",
    exit_from_address_az: "",
    exit_from_address_ru: "",
    exit_from_address_en: "",
    description_az: "",
    description_ru: "",
    description_en: "",
  });

  // Entrepreneur (Sahibkar) form state
  const [entrepreneurFormData, setEntrepreneurFormData] = useState({
    capacity: "",
    unit_id: "",
    reach_from_address: "",
    photos: [],
    from_id: "",
    to_id: "",
    truck_type_id: "",
    expires_at: "",
    name_az: "",
    name_ru: "",
    name_en: "",
    load_type_az: "",
    load_type_ru: "",
    load_type_en: "",
    exit_from_address_az: "",
    exit_from_address_ru: "",
    exit_from_address_en: "",
    description_az: "",
    description_ru: "",
    description_en: "",
  });

  // Individual form handlers
  const handleIndividualInputChange = (field, value) => {
    setIndividualFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIndividualFileChange = (e) => {
    const files = Array.from(e.target.files);
    setIndividualFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitAdvert(individualFormData, "individual");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Legal form handlers
  const handleLegalInputChange = (field, value) => {
    setLegalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLegalFileChange = (e) => {
    const files = Array.from(e.target.files);
    setLegalFormData((prev) => ({
        ...prev,
      photos: [...prev.photos, ...files],
      }));
  };

  const handleLegalDriverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLegalFormData((prev) => ({
        ...prev,
        driver_photo: file,
      }));
    }
  };

  const handleLegalCertificatesChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((f) =>
      (f && f.type === 'application/pdf') || (typeof f?.name === 'string' && f.name.toLowerCase().endsWith('.pdf'))
    );
    if (pdfFiles.length !== files.length) {
      alert('Yalnız PDF formatında sənədlər qəbul olunur.');
    }
    if (pdfFiles.length === 0) return;
    setLegalFormData((prev) => ({
      ...prev,
      driver_certificates: [...prev.driver_certificates, ...pdfFiles],
    }));
  };

  const handleLegalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitAdvert(legalFormData, "legal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Entrepreneur form handlers
  const handleEntrepreneurInputChange = (field, value) => {
    setEntrepreneurFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEntrepreneurFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEntrepreneurFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleEntrepreneurSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitAdvert(entrepreneurFormData, "entrepreneur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format dates
  const formatDateForBackend = (dateString, format = 'datetime') => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    if (format === 'date') {
      // Y-m-d format
      return date.toISOString().slice(0, 10);
    } else {
      // Y-m-d H:i:s format
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }
  };

  // API Integration Functions
  const submitAdvert = async (formData, userType) => {
    const API_BASE = import.meta?.env?.VITE_API_BASE || "https://atfplatform.tw1.ru";
    const API_URL = `${API_BASE}/api/adverts/store`;
    
    // Validate reach_from_address is in the future
    if (formData.reach_from_address) {
      const reachDate = new Date(formData.reach_from_address);
      const now = new Date();
      if (reachDate <= now) {
        toast.error("Çatış tarixi indiki tarixdən sonra olmalıdır!");
        return;
      }
    }
    
    // Create FormData object
    const formDataToSend = new FormData();
    
    if (userType === "individual") {
      // Individual form - only fill relevant fields, others null
      formDataToSend.append("capacity", formData.capacity || "");
      formDataToSend.append("unit_id", formData.unit_id || "");
      formDataToSend.append("reach_from_address", formatDateForBackend(formData.reach_from_address, 'datetime'));
      formDataToSend.append("empty_space", formData.empty_space || "");
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", formData.truck_registration_number || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formatDateForBackend(formData.expires_at, 'date'));
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("name.ru", formData.name_ru || "");
      formDataToSend.append("name.en", formData.name_en || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("load_type.ru", formData.load_type_ru || "");
      formDataToSend.append("load_type.en", formData.load_type_en || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address.ru", formData.exit_from_address_ru || "");
      formDataToSend.append("exit_from_address.en", formData.exit_from_address_en || "");
      formDataToSend.append("description.az", formData.description_az || "");
      formDataToSend.append("description.ru", formData.description_ru || "");
      formDataToSend.append("description.en", formData.description_en || "");
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });
      
      // Don't send fields that are not used in individual form
      
    } else if (userType === "legal") {
      // Legal form - fill all fields
      formDataToSend.append("capacity", formData.capacity || "");
      formDataToSend.append("unit_id", formData.unit_id || "");
      formDataToSend.append("reach_from_address", formatDateForBackend(formData.reach_from_address, 'datetime'));
      formDataToSend.append("empty_space", formData.empty_space || "");
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", formData.truck_registration_number || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formatDateForBackend(formData.expires_at, 'date'));
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("name.ru", formData.name_ru || "");
      formDataToSend.append("name.en", formData.name_en || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("load_type.ru", formData.load_type_ru || "");
      formDataToSend.append("load_type.en", formData.load_type_en || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address.ru", formData.exit_from_address_ru || "");
      formDataToSend.append("exit_from_address.en", formData.exit_from_address_en || "");
      formDataToSend.append("description.az", formData.description_az || "");
      formDataToSend.append("description.ru", formData.description_ru || "");
      formDataToSend.append("description.en", formData.description_en || "");
      formDataToSend.append("driver_full_name.az", formData.driver_full_name_az || "");
      formDataToSend.append("driver_full_name.ru", formData.driver_full_name_ru || "");
      formDataToSend.append("driver_full_name.en", formData.driver_full_name_en || "");
      formDataToSend.append("driver_biography.az", formData.driver_biography_az || "");
      formDataToSend.append("driver_biography.ru", formData.driver_biography_ru || "");
      formDataToSend.append("driver_biography.en", formData.driver_biography_en || "");
      formDataToSend.append("driver_experience.az", formData.driver_experience_az || "");
      formDataToSend.append("driver_experience.ru", formData.driver_experience_ru || "");
      formDataToSend.append("driver_experience.en", formData.driver_experience_en || "");
      
      // Add driver photo
      if (formData.driver_photo) {
        formDataToSend.append("driver_photo", formData.driver_photo);
      }
      
      // Add driver certificates
      formData.driver_certificates.forEach((cert, index) => {
        formDataToSend.append("driver_certificates[]", cert);
      });
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });
      
    } else if (userType === "entrepreneur") {
      // Entrepreneur form - only fill relevant fields, others null
      formDataToSend.append("capacity", formData.capacity || "");
      formDataToSend.append("unit_id", formData.unit_id || "");
      formDataToSend.append("reach_from_address", formatDateForBackend(formData.reach_from_address, 'datetime'));
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formatDateForBackend(formData.expires_at, 'date'));
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("name.ru", formData.name_ru || "");
      formDataToSend.append("name.en", formData.name_en || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("load_type.ru", formData.load_type_ru || "");
      formDataToSend.append("load_type.en", formData.load_type_en || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address.ru", formData.exit_from_address_ru || "");
      formDataToSend.append("exit_from_address.en", formData.exit_from_address_en || "");
      formDataToSend.append("description.az", formData.description_az || "");
      formDataToSend.append("description.ru", formData.description_ru || "");
      formDataToSend.append("description.en", formData.description_en || "");
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });
      
      // Don't send fields that are not used in entrepreneur form
    }

    try {
      console.log("Submitting advert with token:", token ? "Present" : "Missing");
      console.log("API URL:", API_URL);
      console.log("FormData entries:", Array.from(formDataToSend.entries()));
      console.log("User type:", userType);
      console.log("Unit ID being sent:", formData.unit_id);
      console.log("Available units:", units);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!response.ok) {
        const errorBodyText = await response.text().catch(() => "");
        let errorBody;
        try { errorBody = errorBodyText ? JSON.parse(errorBodyText) : null; } catch { errorBody = { message: errorBodyText }; }
        const message = errorBody?.message || `HTTP ${response.status}`;
        console.error("Error:", errorBody || message);
        toast.error("Xəta baş verdi: " + message);
        return;
      }

      // Handle success with possible empty/HTML body
      let result = null;
      if (isJson) {
        const text = await response.text();
        if (text) {
          try { result = JSON.parse(text); } catch { result = null; }
        }
      }
      console.log("Success:", result);
      toast.success("Elan uğurla yaradıldı!");
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Şəbəkə xətası: " + (error?.message || "Naməlum xəta"));
    }
  };


  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        <div className="bg-[#F4F4F4] rounded-[16px] p-4 md:p-8">
          {/* Title */}
          <h1 className="text-[24px] font-semibold text-[#2E92A0] mb-6">
            Elanın məlumatlarını daxil edin
          </h1>

          {/* Single role label (tabs removed) */}
          <div className="flex items-center justify-between mb-6">
            <div className="px-4 py-2 rounded-lg bg-[#E8F5F7] text-[#2E92A0] font-medium inline-flex items-center gap-2">
              <span>{roleLabels[allowedTab] || ""}</span>
            </div>
          </div>
          {/* Avoid flicker until role is resolved and data is loaded */}
          {isRoleLoading || isDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {/* Language Tabs */}
            <div className="flex mb-4 mt-2 gap-2">
              {['az', 'en', 'ru'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 rounded font-bold border-b-2 transition-all ${activeLangTab === lang ? 'border-[#2E92A0] text-[#2E92A0]' : 'border-transparent text-[#27272A]'}`}
                >
                  {lang === 'az' ? 'AZƏRBAYCAN' : lang === 'en' ? 'İNGLİS' : 'RUS'}
                </button>
              ))}
            </div>

            {/* Individual Form */}
            {activeTab === "individual" && (
              <motion.form 
                key="individual-form"
                onSubmit={handleIndividualSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* NAME FIELDS - Individual Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={individualFormData.name_az}
                        onChange={(e) => handleIndividualInputChange("name_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={individualFormData.name_ru}
                        onChange={(e) => handleIndividualInputChange("name_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={individualFormData.name_en}
                        onChange={(e) => handleIndividualInputChange("name_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                  </div>

                  {/* LOAD TYPE FIELDS - Individual Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={individualFormData.load_type_az}
                        onChange={(e) => handleIndividualInputChange("load_type_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={individualFormData.load_type_ru}
                        onChange={(e) => handleIndividualInputChange("load_type_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={individualFormData.load_type_en}
                        onChange={(e) => handleIndividualInputChange("load_type_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                  </div>

                  {/* EXIT FROM ADDRESS FIELDS - Individual Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={individualFormData.exit_from_address_az}
                        onChange={(e) => handleIndividualInputChange("exit_from_address_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={individualFormData.exit_from_address_ru}
                        onChange={(e) => handleIndividualInputChange("exit_from_address_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={individualFormData.exit_from_address_en}
                        onChange={(e) => handleIndividualInputChange("exit_from_address_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                  </div>

                  <div>
                    <input
                      type={individualFormData.reach_from_address ? "datetime-local" : "text"}
                      value={individualFormData.reach_from_address}
                      onChange={(e) =>
                        handleIndividualInputChange("reach_from_address", e.target.value)
                      }
                      onFocus={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'datetime-local';
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış tarixi"
                    />
                  </div>

                  <div className="flex w-full">
                    <div className="w-[80%]">
                    <input
                      type="text"
                        value={individualFormData.capacity}
                      onChange={(e) =>
                          handleIndividualInputChange("capacity", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-l-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Tutum"
                      />
                    </div>
                    <div className="w-[20%]">
                      <select
                        value={individualFormData.unit_id}
                        onChange={(e) =>
                          handleIndividualInputChange("unit_id", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-r-lg h-[50px] focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                      >
                        <option value="">Vahid</option>
                        {units.map((unit, index) => (
                          <option key={index} value={unit.id || (index + 1)}>
                            {unit.type?.az || unit.type?.en || unit.type?.ru || `Unit ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={individualFormData.empty_space}
                      onChange={(e) =>
                        handleIndividualInputChange("empty_space", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Boş yer"
                    />
                  </div>

                  <div>
                    <select
                      value={individualFormData.truck_type_id}
                      onChange={(e) =>
                        handleIndividualInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Tır növü seçin</option>
                      {truckTypes.map((truckType, index) => (
                        <option key={index} value={truckType.id || (index + 1)}>
                          {truckType.type?.az || truckType.type?.en || truckType.type?.ru || `Truck Type ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                      <input
                        type="text"
                      value={individualFormData.truck_registration_number}
                        onChange={(e) =>
                        handleIndividualInputChange("truck_registration_number", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Tır qeydiyyat nömrəsi"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <select
                      value={individualFormData.from_id}
                      onChange={(e) =>
                        handleIndividualInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Haradan Çıxılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={individualFormData.to_id}
                      onChange={(e) =>
                        handleIndividualInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Hara Çatdırılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type={individualFormData.expires_at ? "datetime-local" : "text"}
                      value={individualFormData.expires_at}
                      onChange={(e) =>
                        handleIndividualInputChange("expires_at", e.target.value)
                      }
                      onFocus={(e) => {
                        e.target.type = 'datetime-local';
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Elanın bitmə tarixi"
                    />
                  </div>

                  {/* DESCRIPTION FIELDS - Individual Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <textarea
                        value={individualFormData.description_az}
                        onChange={(e) => handleIndividualInputChange("description_az", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <textarea
                        value={individualFormData.description_ru}
                        onChange={(e) => handleIndividualInputChange("description_ru", e.target.value)}
                        rows={4}
                        className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <textarea
                        value={individualFormData.description_en}
                        onChange={(e) => handleIndividualInputChange("description_en", e.target.value)}
                        rows={4}
                        className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                  </div>

                  <div className="mt-[18px]">
                    <div className="border-2 h-[116px] flex items-center justify-center border-dashed border-[#2E92A0] rounded-lg p-6 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleIndividualFileChange}
                        className="hidden"
                        id="individual-photos-upload"
                      />
                      <label
                        htmlFor="individual-photos-upload"
                        className="cursor-pointer"
                      >
                        <IoCamera className="mx-auto text-4xl text-[#2E92A0] mb-2" />
                        <p className="text-[#2E92A0] font-medium">Şəkillər əlavə edin</p>
                        {individualFormData.photos.length > 0 && (
                          <p className="text-sm text-[#2E92A0] mt-2">
                            Seçilmiş: {individualFormData.photos.length} şəkil
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Göndərilir..." : "Tamamla"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Legal Form */}
          {activeTab === "legal" && (
            <motion.form 
              key="legal-form"
              onSubmit={handleLegalSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* NAME FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={legalFormData.name_az}
                        onChange={(e) => handleLegalInputChange("name_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={legalFormData.name_ru}
                        onChange={(e) => handleLegalInputChange("name_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={legalFormData.name_en}
                        onChange={(e) => handleLegalInputChange("name_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Elanın adı "
                      />
                    )}
                  </div>

                  {/* LOAD TYPE FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={legalFormData.load_type_az}
                        onChange={(e) => handleLegalInputChange("load_type_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={legalFormData.load_type_ru}
                        onChange={(e) => handleLegalInputChange("load_type_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={legalFormData.load_type_en}
                        onChange={(e) => handleLegalInputChange("load_type_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük növü "
                      />
                    )}
                  </div>

                  {/* EXIT FROM ADDRESS FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={legalFormData.exit_from_address_az}
                        onChange={(e) => handleLegalInputChange("exit_from_address_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={legalFormData.exit_from_address_ru}
                        onChange={(e) => handleLegalInputChange("exit_from_address_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={legalFormData.exit_from_address_en}
                        onChange={(e) => handleLegalInputChange("exit_from_address_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Çıxış ünvanı "
                      />
                    )}
                  </div>

                  <div>
                    <input
                      type={legalFormData.reach_from_address ? "datetime-local" : "text"}
                      value={legalFormData.reach_from_address}
                      onChange={(e) =>
                        handleLegalInputChange("reach_from_address", e.target.value)
                      }
                      onFocus={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'datetime-local';
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış tarixi"
                    />
                  </div>

                  <div className="flex w-full">
                    <div className="w-[80%]">
                      <input
                        type="text"
                        value={legalFormData.capacity}
                        onChange={(e) =>
                          handleLegalInputChange("capacity", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-l-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Tutum"
                      />
                    </div>
                    <div className="w-[20%]">
                      <select
                        value={legalFormData.unit_id}
                        onChange={(e) =>
                          handleLegalInputChange("unit_id", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-r-lg h-[50px] focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                      >
                        <option value="">Vahid</option>
                        {units.map((unit, index) => (
                          <option key={index} value={unit.id || (index + 1)}>
                            {unit.type?.az || unit.type?.en || unit.type?.ru || `Unit ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.empty_space}
                      onChange={(e) =>
                        handleLegalInputChange("empty_space", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Boş yer"
                    />
                  </div>

                  <div>
                    <select
                      value={legalFormData.truck_type_id}
                      onChange={(e) =>
                        handleLegalInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Tır növü seçin</option>
                      {truckTypes.map((truckType, index) => (
                        <option key={index} value={truckType.id || (index + 1)}>
                          {truckType.type?.az || truckType.type?.en || truckType.type?.ru || `Truck Type ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.truck_registration_number}
                      onChange={(e) =>
                        handleLegalInputChange("truck_registration_number", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Tır qeydiyyat nömrəsi"
                    />
                  </div>
                  <div className="border-2 h-[116px] flex items-center justify-center border-dashed border-[#2E92A0] rounded-lg p-4 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleLegalCertificatesChange}
                      className="hidden"
                      id="legal-certificates-upload"
                    />
                    <label
                      htmlFor="legal-certificates-upload"
                      className="cursor-pointer"
                    >
                      <IoCamera className="mx-auto text-2xl text-[#2E92A0] mb-2" />
                      <p className="text-[#2E92A0] font-medium text-sm">Sürücü sertifikatları</p>
                      {legalFormData.driver_certificates.length > 0 && (
                        <p className="text-xs text-[#2E92A0] mt-1">
                          Seçilmiş: {legalFormData.driver_certificates.length} sənəd
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Photos Upload */}
                  <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-4 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleLegalFileChange}
                      className="hidden"
                      id="legal-photos-upload"
                    />
                    <label
                      htmlFor="legal-photos-upload"
                      className="cursor-pointer"
                    >
                      <IoCamera className="mx-auto text-2xl text-[#2E92A0] mb-2" />
                      <p className="text-[#2E92A0] font-medium text-sm">Şəkillər</p>
                      {legalFormData.photos.length > 0 && (
                        <p className="text-xs text-[#2E92A0] mt-1">
                          Seçilmiş: {legalFormData.photos.length} şəkil
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <select
                      value={legalFormData.from_id}
                      onChange={(e) =>
                        handleLegalInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Haradan Çıxılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                      </div>

                  <div>
                    <select
                      value={legalFormData.to_id}
                      onChange={(e) =>
                        handleLegalInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Hara Çatdırılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                    </div>

                  <div>
                    <input
                      type={legalFormData.expires_at ? "datetime-local" : "text"}
                      value={legalFormData.expires_at}
                      onChange={(e) =>
                        handleLegalInputChange("expires_at", e.target.value)
                      }
                      onFocus={(e) => {
                        e.target.type = 'datetime-local';
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Elanın bitmə tarixi"
                    />
                  </div>

                  {/* DRIVER NAME FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <input
                        type="text"
                        value={legalFormData.driver_full_name_az}
                        onChange={(e) => handleLegalInputChange("driver_full_name_az", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Sürücünün adı soyadı "
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <input
                        type="text"
                        value={legalFormData.driver_full_name_ru}
                        onChange={(e) => handleLegalInputChange("driver_full_name_ru", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Sürücünün adı soyadı "
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <input
                        type="text"
                        value={legalFormData.driver_full_name_en}
                        onChange={(e) => handleLegalInputChange("driver_full_name_en", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Sürücünün adı soyadı "
                      />
                    )}
                  </div>

                  {/* DRIVER BIOGRAPHY FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <textarea
                        value={legalFormData.driver_biography_az}
                        onChange={(e) => handleLegalInputChange("driver_biography_az", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün bioqrafiyası ..."
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <textarea
                        value={legalFormData.driver_biography_ru}
                        onChange={(e) => handleLegalInputChange("driver_biography_ru", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün bioqrafiyası ..."
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <textarea
                        value={legalFormData.driver_biography_en}
                        onChange={(e) => handleLegalInputChange("driver_biography_en", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün bioqrafiyası ..."
                      />
                    )}
                  </div>

                  {/* DRIVER EXPERIENCE FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <textarea
                        value={legalFormData.driver_experience_az}
                        onChange={(e) => handleLegalInputChange("driver_experience_az", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün təcrübəsi ..."
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <textarea
                        value={legalFormData.driver_experience_ru}
                        onChange={(e) => handleLegalInputChange("driver_experience_ru", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün təcrübəsi ..."
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <textarea
                        value={legalFormData.driver_experience_en}
                        onChange={(e) => handleLegalInputChange("driver_experience_en", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Sürücünün təcrübəsi ..."
                      />
                    )}
                  </div>

                  {/* DESCRIPTION FIELDS - Legal Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <textarea
                        value={legalFormData.description_az}
                        onChange={(e) => handleLegalInputChange("description_az", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <textarea
                        value={legalFormData.description_ru}
                        onChange={(e) => handleLegalInputChange("description_ru", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <textarea
                        value={legalFormData.description_en}
                        onChange={(e) => handleLegalInputChange("description_en", e.target.value)}
                        rows={3}
                        className="w-full h-[116px] mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                        placeholder="Təsvir ..."
                      />
                    )}
                  </div>

                  {/* Driver Photo Upload */}
                  <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-4 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLegalDriverPhotoChange}
                      className="hidden"
                      id="legal-driver-photo-upload"
                    />
                    <label
                      htmlFor="legal-driver-photo-upload"
                      className="cursor-pointer"
                    >
                      <IoCamera className="mx-auto text-2xl text-[#2E92A0] mb-2" />
                      <p className="text-[#2E92A0] font-medium text-sm">Sürücü şəkli</p>
                      {legalFormData.driver_photo && (
                        <p className="text-xs text-[#2E92A0] mt-1">
                          Seçilmiş: {legalFormData.driver_photo.name}
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Driver Certificates Upload */}
                  
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Göndərilir..." : "Tamamla"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Entrepreneur Form */}
          {activeTab === "entrepreneur" && (
            <motion.form 
              key="entrepreneur-form"
              onSubmit={handleEntrepreneurSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* NAME FIELDS - Entrepreneur Form */}
                  <div>
                            <input
                              type="text"
                      value={entrepreneurFormData.name_az}
                              onChange={(e) =>
                        handleEntrepreneurInputChange("name_az", e.target.value)
                              }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı "
                            />
                            <input
                      type="text"
                      value={entrepreneurFormData.name_ru}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("name_ru", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı "
                    />
                    <input
                      type="text"
                      value={entrepreneurFormData.name_en}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("name_en", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı "
                    />
                  </div>

                  {/* LOAD TYPE FIELDS - Entrepreneur Form */}
                  <div>
                              <input
                      type="text"
                      value={entrepreneurFormData.load_type_az}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("load_type_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü "
                    />
                    <input
                      type="text"
                      value={entrepreneurFormData.load_type_ru}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("load_type_ru", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü "
                    />
                    <input
                      type="text"
                      value={entrepreneurFormData.load_type_en}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("load_type_en", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü "
                    />
                  </div>

                  {/* EXIT FROM ADDRESS FIELDS - Entrepreneur Form */}
                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.exit_from_address_az}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("exit_from_address_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı "
                    />
                    <input
                      type="text"
                      value={entrepreneurFormData.exit_from_address_ru}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("exit_from_address_ru", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı "
                    />
                    <input
                      type="text"
                      value={entrepreneurFormData.exit_from_address_en}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("exit_from_address_en", e.target.value)
                      }
                      className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı "
                    />
                  </div>

                  <div>
                    <input
                      type={entrepreneurFormData.reach_from_address ? "datetime-local" : "text"}
                      value={entrepreneurFormData.reach_from_address}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("reach_from_address", e.target.value)
                      }
                      onFocus={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'datetime-local';
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış tarixi"
                    />
                  </div>

                  <div className="flex w-full">
                    <div className="w-[80%]">
                      <input
                        type="text"
                        value={entrepreneurFormData.capacity}
                        onChange={(e) =>
                          handleEntrepreneurInputChange("capacity", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-l-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Tutum"
                      />
                    </div>
                    <div className="w-[20%]">
                      <select
                        value={entrepreneurFormData.unit_id}
                        onChange={(e) =>
                          handleEntrepreneurInputChange("unit_id", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-r-lg h-[50px] focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                      >
                        <option value="">Vahid</option>
                        {units.map((unit, index) => (
                          <option key={index} value={unit.id || (index + 1)}>
                            {unit.type?.az || unit.type?.en || unit.type?.ru || `Unit ${index + 1}`}
                          </option>
                        ))}
                      </select>
                            </div>
                  </div>

                  <div>
                    <select
                      value={entrepreneurFormData.truck_type_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Tır növü seçin</option>
                      {truckTypes.map((truckType, index) => (
                        <option key={index} value={truckType.id || (index + 1)}>
                          {truckType.type?.az || truckType.type?.en || truckType.type?.ru || `Truck Type ${index + 1}`}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <select
                      value={entrepreneurFormData.from_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Haradan Çıxılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={entrepreneurFormData.to_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      disabled={isDataLoading}
                    >
                      <option value="">Hara Çatdırılacaq Seç</option>
                      {areas.map((area, index) => (
                        <option key={index} value={area.id || (index + 1)}>
                          {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type={entrepreneurFormData.expires_at ? "datetime-local" : "text"}
                      value={entrepreneurFormData.expires_at}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("expires_at", e.target.value)
                      }
                      onFocus={(e) => {
                        e.target.type = 'datetime-local';
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Elanın bitmə tarixi"
                    />
                  </div>

                  {/* DESCRIPTION FIELDS - Entrepreneur Form */}
                  <div>
                    {activeLangTab === 'az' && (
                      <textarea
                        value={entrepreneurFormData.description_az}
                        onChange={(e) =>
                          handleEntrepreneurInputChange("description_az", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'ru' && (
                      <textarea
                        value={entrepreneurFormData.description_ru}
                        onChange={(e) =>
                          handleEntrepreneurInputChange("description_ru", e.target.value)
                        }
                        rows={4}
                        className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                    {activeLangTab === 'en' && (
                      <textarea
                        value={entrepreneurFormData.description_en}
                        onChange={(e) =>
                          handleEntrepreneurInputChange("description_en", e.target.value)
                        }
                        rows={4}
                        className="w-full mt-1 px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                        placeholder="Təsvir ..."
                      />
                    )}
                  </div>

                  <div className="mt-[18px]">
                  <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-6 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                        multiple
                        onChange={handleEntrepreneurFileChange}
                      className="hidden"
                        id="entrepreneur-photos-upload"
                    />
                    <label
                        htmlFor="entrepreneur-photos-upload"
                      className="cursor-pointer"
                    >
                      <IoCamera className="mx-auto text-4xl text-[#2E92A0] mb-2" />
                        <p className="text-[#2E92A0] font-medium">Şəkillər əlavə edin</p>
                        {entrepreneurFormData.photos.length > 0 && (
                        <p className="text-sm text-[#2E92A0] mt-2">
                            Seçilmiş: {entrepreneurFormData.photos.length} şəkil
                        </p>
                      )}
                    </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Göndərilir..." : "Tamamla"}
                </button>
              </div>
            </motion.form>
          )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
