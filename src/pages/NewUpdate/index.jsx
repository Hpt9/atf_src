import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoCamera } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

export const NewUpdate = () => {
  const [activeTab, setActiveTab] = useState("individual"); // 'individual', 'legal', or 'entrepreneur'
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    load_type_az: "",
    exit_from_address_az: "",
    description_az: "",
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
    driver_biography_az: "",
    name_az: "",
    load_type_az: "",
    exit_from_address_az: "",
    description_az: "",
    driver_experience_az: "",
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
    load_type_az: "",
    exit_from_address_az: "",
    description_az: "",
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
    setLegalFormData((prev) => ({
      ...prev,
      driver_certificates: [...prev.driver_certificates, ...files],
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

  // API Integration Functions
  const submitAdvert = async (formData, userType) => {
    const API_URL = "https://atfplatform.tw1.ru/api/adverts/store";
    
    // Create FormData object
    const formDataToSend = new FormData();
    
    if (userType === "individual") {
      // Individual form - only fill relevant fields, others null
      formDataToSend.append("capacity", formData.capacity || "");
      formDataToSend.append("unit_id", formData.unit_id || "");
      formDataToSend.append("reach_from_address", formData.reach_from_address || "");
      formDataToSend.append("empty_space", formData.empty_space || "");
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", formData.truck_registration_number || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formData.expires_at || "");
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("description.az", formData.description_az || "");
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });
      
      // Set null for fields not used in individual
      formDataToSend.append("driver_certificates[]", null);
      formDataToSend.append("driver_photo", null);
      formDataToSend.append("driver_full_name.az", null);
      formDataToSend.append("driver_biography.az", null);
      formDataToSend.append("driver_experience.az", null);
      
    } else if (userType === "legal") {
      // Legal form - fill all fields
      formDataToSend.append("capacity", formData.capacity || "");
      formDataToSend.append("unit_id", formData.unit_id || "");
      formDataToSend.append("reach_from_address", formData.reach_from_address || "");
      formDataToSend.append("empty_space", formData.empty_space || "");
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", formData.truck_registration_number || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formData.expires_at || "");
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("description.az", formData.description_az || "");
      formDataToSend.append("driver_full_name.az", formData.driver_full_name_az || "");
      formDataToSend.append("driver_biography.az", formData.driver_biography_az || "");
      formDataToSend.append("driver_experience.az", formData.driver_experience_az || "");
      
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
      formDataToSend.append("reach_from_address", formData.reach_from_address || "");
      formDataToSend.append("truck_type_id", formData.truck_type_id || "");
      formDataToSend.append("from_id", formData.from_id || "");
      formDataToSend.append("to_id", formData.to_id || "");
      formDataToSend.append("expires_at", formData.expires_at || "");
      formDataToSend.append("name.az", formData.name_az || "");
      formDataToSend.append("load_type.az", formData.load_type_az || "");
      formDataToSend.append("exit_from_address.az", formData.exit_from_address_az || "");
      formDataToSend.append("description.az", formData.description_az || "");
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });
      
      // Set null for fields not used in entrepreneur
      formDataToSend.append("driver_certificates[]", null);
      formDataToSend.append("driver_photo", null);
      formDataToSend.append("empty_space", null);
      formDataToSend.append("truck_registration_number", null);
      formDataToSend.append("driver_full_name.az", null);
      formDataToSend.append("driver_biography.az", null);
      formDataToSend.append("driver_experience.az", null);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
        headers: {
          // Don't set Content-Type header, let browser set it with boundary for FormData
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        // Handle success (show success message, redirect, etc.)
        alert("Elan uğurla yaradıldı!");
        // Reset form or redirect
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert("Xəta baş verdi: " + (error.message || "Naməlum xəta"));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Şəbəkə xətası: " + error.message);
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

          {/* Tabs */}
          <div className="flex border-b border-[#E7E7E7] mb-6">
            <button
              onClick={() => setActiveTab("individual")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "individual"
                  ? "text-[#2E92A0] border-b-2 border-[#2E92A0]"
                  : "text-[#6B7280] hover:text-[#2E92A0]"
              }`}
            >
              Fiziki şəxs
            </button>
            <button
              onClick={() => setActiveTab("legal")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "legal"
                  ? "text-[#2E92A0] border-b-2 border-[#2E92A0]"
                  : "text-[#6B7280] hover:text-[#2E92A0]"
              }`}
            >
              Hüquqi şəxs
            </button>
            <button
              onClick={() => setActiveTab("entrepreneur")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "entrepreneur"
                  ? "text-[#2E92A0] border-b-2 border-[#2E92A0]"
                  : "text-[#6B7280] hover:text-[#2E92A0]"
              }`}
            >
              Sahibkar
            </button>
          </div>
          <AnimatePresence mode="wait">
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
                  <div>
                    <input
                      type="text"
                      value={individualFormData.name_az}
                      onChange={(e) =>
                        handleIndividualInputChange("name_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={individualFormData.load_type_az}
                      onChange={(e) =>
                        handleIndividualInputChange("load_type_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={individualFormData.exit_from_address_az}
                      onChange={(e) =>
                        handleIndividualInputChange("exit_from_address_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={individualFormData.reach_from_address}
                      onChange={(e) =>
                        handleIndividualInputChange("reach_from_address", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış ünvanı"
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
                      >
                        <option value="">Vahid</option>
                        <option value="1">Ton</option>
                        <option value="2">Kq</option>
                        <option value="3">Litr</option>
                        <option value="4">Metr</option>
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
                    <input
                      type="text"
                      value={individualFormData.truck_type_id}
                      onChange={(e) =>
                        handleIndividualInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Tır növü"
                    />
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
                    <input
                      type="text"
                      value={individualFormData.from_id}
                      onChange={(e) =>
                        handleIndividualInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Haradan ID"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={individualFormData.to_id}
                      onChange={(e) =>
                        handleIndividualInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Hara ID"
                    />
                  </div>

                  <div>
                    <input
                      type="datetime-local"
                      value={individualFormData.expires_at}
                      onChange={(e) =>
                        handleIndividualInputChange("expires_at", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Bitmə tarixi"
                    />
                  </div>

                  <div>
                    <textarea
                      value={individualFormData.description_az}
                      onChange={(e) =>
                        handleIndividualInputChange("description_az", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                      placeholder="Təsvir..."
                    />
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
                  <div>
                    <input
                      type="text"
                      value={legalFormData.name_az}
                      onChange={(e) =>
                        handleLegalInputChange("name_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.load_type_az}
                      onChange={(e) =>
                        handleLegalInputChange("load_type_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.exit_from_address_az}
                      onChange={(e) =>
                        handleLegalInputChange("exit_from_address_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.reach_from_address}
                      onChange={(e) =>
                        handleLegalInputChange("reach_from_address", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış ünvanı"
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
                      >
                        <option value="">Vahid</option>
                        <option value="1">Ton</option>
                        <option value="2">Kq</option>
                        <option value="3">Litr</option>
                        <option value="4">Metr</option>
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
                    <input
                      type="text"
                      value={legalFormData.truck_type_id}
                      onChange={(e) =>
                        handleLegalInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Tır növü"
                    />
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
                      accept="image/*"
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
                    <input
                      type="text"
                      value={legalFormData.from_id}
                      onChange={(e) =>
                        handleLegalInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Haradan ID"
                    />
                      </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.to_id}
                      onChange={(e) =>
                        handleLegalInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Hara ID"
                    />
                    </div>

                  <div>
                    <input
                      type="datetime-local"
                      value={legalFormData.expires_at}
                      onChange={(e) =>
                        handleLegalInputChange("expires_at", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Bitmə tarixi"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={legalFormData.driver_full_name_az}
                      onChange={(e) =>
                        handleLegalInputChange("driver_full_name_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Sürücünün adı soyadı"
                    />
                  </div>

                  <div>
                    <textarea
                      value={legalFormData.driver_biography_az}
                      onChange={(e) =>
                        handleLegalInputChange("driver_biography_az", e.target.value)
                      }
                      rows={3}
                      className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                      placeholder="Sürücünün bioqrafiyası"
                    />
                  </div>

                  <div>
                    <textarea
                      value={legalFormData.driver_experience_az}
                      onChange={(e) =>
                        handleLegalInputChange("driver_experience_az", e.target.value)
                      }
                      rows={3}
                      className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                      placeholder="Sürücünün təcrübəsi"
                    />
                  </div>

                  <div>
                    <textarea
                      value={legalFormData.description_az}
                      onChange={(e) =>
                        handleLegalInputChange("description_az", e.target.value)
                      }
                      rows={3}
                      className="w-full h-[116px] px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                      placeholder="Təsvir"
                    />
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
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2"
                            >
                  Ləğv et
                            </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2"
                >
                  Tamamla
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
                  <div>
                            <input
                              type="text"
                      value={entrepreneurFormData.name_az}
                              onChange={(e) =>
                        handleEntrepreneurInputChange("name_az", e.target.value)
                              }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adı"
                            />
                  </div>

                  <div>
                              <input
                      type="text"
                      value={entrepreneurFormData.load_type_az}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("load_type_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Yük növü"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.exit_from_address_az}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("exit_from_address_az", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çıxış ünvanı"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.reach_from_address}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("reach_from_address", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Çatış ünvanı"
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
                      >
                        <option value="">Vahid</option>
                        <option value="1">Ton</option>
                        <option value="2">Kq</option>
                        <option value="3">Litr</option>
                        <option value="4">Metr</option>
                      </select>
                            </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.truck_type_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("truck_type_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Tır növü"
                    />
                    </div>
                  </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.from_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("from_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Haradan ID"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={entrepreneurFormData.to_id}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("to_id", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Hara ID"
                    />
                  </div>

                  <div>
                    <input
                      type="datetime-local"
                      value={entrepreneurFormData.expires_at}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("expires_at", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="Bitmə tarixi"
                    />
                  </div>

                  <div>
                    <textarea
                      value={entrepreneurFormData.description_az}
                      onChange={(e) =>
                        handleEntrepreneurInputChange("description_az", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium h-[116px]"
                      placeholder="Təsvir..."
                    />
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
        </div>
      </div>
    </div>
  );
};
