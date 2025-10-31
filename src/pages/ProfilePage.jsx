import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import useLanguageStore from '../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPerson, IoMail, IoCall, IoLockClosed, IoEye, IoEyeOff, IoCheckmarkCircle, IoBusiness, IoCar, IoLocation, IoCreate, IoTrash } from 'react-icons/io5';
import { FaPlus } from "react-icons/fa";
import DEFAULT_AVATAR from '../assets/images/user_avatar.avif';
import AdvertEditForm from "../components/AdvertEditForm";
const ProfilePage = () => {
  const getPhotoUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const cleaned = path.replace(/^\/?(storage\/)?/, '');
    return `https://atfplatform.tw1.ru/storage/${cleaned}`;
  };
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeAdvertLangTab, setActiveAdvertLangTab] = useState('az');
  const [isEditingAdvert, setIsEditingAdvert] = useState(null); // null or advert ID
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [userData, setUserData] = useState(null);

  // Advert editing states
  const [editingAdvertData, setEditingAdvertData] = useState(null);
  const [isSubmittingAdvert, setIsSubmittingAdvert] = useState(false);

  // Branch editing states
  const [editingBranchData, setEditingBranchData] = useState(null);
  const [isEditingBranch, setIsEditingBranch] = useState(null);
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Add branch states
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [addBranchData, setAddBranchData] = useState({
    name: '',
    description: '',
    status: 'active',
    photo: null
  });
  const [isSubmittingAddBranch, setIsSubmittingAddBranch] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Text translations
  const texts = {
    title: {
      en: "Profile Information",
      ru: "Информация профиля",
      az: "Profil məlumatları"
    },
    firstName: {
      en: "First Name",
      ru: "Имя",
      az: "Ad"
    },
    lastName: {
      en: "Last Name",
      ru: "Фамилия",
      az: "Soyad"
    },
    email: {
      en: "Email",
      ru: "Электронная почта",
      az: "E-poçt"
    },
    phone: {
      en: "Phone",
      ru: "Телефон",
      az: "Telefon"
    },
    newPassword: {
      en: "New Password",
      ru: "Новый пароль",
      az: "Yeni şifrə"
    },
    confirmPassword: {
      en: "Confirm New Password",
      ru: "Подтвердите новый пароль",
      az: "Yeni şifrəni təsdiqlə"
    },
    passwordPlaceholder: {
      en: "Leave empty to keep unchanged",
      ru: "Оставьте пустым, чтобы не менять",
      az: "Boş buraxsanız dəyişilməyəcək"
    },
    cancel: {
      en: "Cancel",
      ru: "Отмена",
      az: "Ləğv et"
    },
    save: {
      en: "Save",
      ru: "Сохранить",
      az: "Yadda saxla"
    },
    updating: {
      en: "Updating...",
      ru: "Обновление...",
      az: "Yenilənir..."
    },
    edit: {
      en: "Edit",
      ru: "Редактировать",
      az: "Redaktə et"
    },
    passwordErrors: {
      mismatch: {
        en: "Passwords don't match",
        ru: "Пароли не совпадают",
        az: "Şifrələr eyni deyil"
      },
      tooShort: {
        en: "Password must be at least 6 characters",
        ru: "Пароль должен содержать не менее 6 символов",
        az: "Şifrə ən azı 6 simvol olmalıdır"
      }
    },
    toastMessages: {
      loadError: {
        en: "Could not load data",
        ru: "Не удалось загрузить данные",
        az: "Məlumatları yükləmək mümkün olmadı"
      },
      updateSuccess: {
        en: "Your information has been successfully updated",
        ru: "Ваша информация успешно обновлена",
        az: "Məlumatlarınız uğurla yeniləndi"
      },
      validationError: {
        en: "Information is not valid",
        ru: "Информация недействительна",
        az: "Məlumatlar düzgün deyil"
      }
    },
    // Role-specific translations
    roleLabels: {
      individual: {
        en: "Individual",
        ru: "Физическое лицо",
        az: "Fiziki şəxs"
      },
      legal_entity: {
        en: "Legal Entity",
        ru: "Юридическое лицо",
        az: "Hüquqi şəxs"
      },
      entrepreneur: {
        en: "Entrepreneur",
        ru: "Предприниматель",
        az: "Sahibkar"
      }
    },
    // Additional fields
    truckCount: {
      en: "Truck Count",
      ru: "Количество грузовиков",
      az: "Tır sayı"
    },
    emptyTruckCount: {
      en: "Empty Trucks",
      ru: "Пустые грузовики",
      az: "Boş tırlar"
    },
    voen: {
      en: "VOEN",
      ru: "ВОЕН",
      az: "VOEN"
    },
    description: {
      en: "Description",
      ru: "Описание",
      az: "Təsvir"
    },
    website: {
      en: "Website",
      ru: "Веб-сайт",
      az: "Veb sayt"
    },
    adverts: {
      en: "My Adverts",
      ru: "Мои объявления",
      az: "Elanlarım"
    },
    branches: {
      en: "Branches",
      ru: "Филиалы",
      az: "Filiallar"
    },
    noAdverts: {
      en: "No adverts found",
      ru: "Объявления не найдены",
      az: "Elan tapılmadı"
    },
    noBranches: {
      en: "No branches found",
      ru: "Филиалы не найдены",
      az: "Filial tapılmadı"
    }
  };

  const fetchUserData = async () => {
    setInitialLoading(true);
    try {
      if (!token) {
        navigate('/giris?type=login');
        return null;
      }

      const response = await axios.get('https://atfplatform.tw1.ru/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('User data fetched:', response.data);
      const userData = response.data?.data || null;
      setUserData(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(texts.toastMessages.loadError[language] || texts.toastMessages.loadError.az);
      navigate('/giris?type=login');
      return null;
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();

      if (userData) {
        // Format the phone number when loading user data
        const formattedPhone = userData.phone ? formatPhoneNumber(userData.phone) : '';

        setFormData({
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          phone: formattedPhone,
          password: '',
          password_confirmation: ''
        });
      }
    };

    loadUserData();
  }, [token, navigate, language]);

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, '');

    // Return empty if no input
    if (number.length === 0) return '';

    // Start building the formatted number
    let formatted = '+';

    // Add the country code
    if (number.length >= 3) {
      formatted += number.slice(0, 3);
      if (number.length > 3) formatted += '-';
    } else {
      return formatted + number;
    }

    // Add the operator code
    if (number.length >= 5) {
      formatted += number.slice(3, 5);
      if (number.length > 5) formatted += '-';
    } else {
      return formatted + number.slice(3);
    }

    // Add the first part of subscriber number
    if (number.length >= 8) {
      formatted += number.slice(5, 8);
      if (number.length > 8) formatted += '-';
    } else {
      return formatted + number.slice(5);
    }

    // Add the second part
    if (number.length >= 10) {
      formatted += number.slice(8, 10);
      if (number.length > 10) formatted += '-';
    } else {
      return formatted + number.slice(8);
    }

    // Add the last part
    if (number.length >= 12) {
      formatted += number.slice(10, 12);
    } else {
      return formatted + number.slice(10);
    }

    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number formatting
    if (name === 'phone') {
      const formattedNumber = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear password error when user starts typing new passwords
    if (name === 'password' || name === 'password_confirmation') {
      setPasswordError('');
    }
  };

  const validatePasswords = (requireOld = false) => {
    if (requireOld && !formData.old_password) {
      setPasswordError(texts.passwordErrors.tooShort[language] || texts.passwordErrors.tooShort.az);
      return false;
    }
    if (formData.password || formData.password_confirmation) {
      if (formData.password !== formData.password_confirmation) {
        setPasswordError(texts.passwordErrors.mismatch[language] || texts.passwordErrors.mismatch.az);
        return false;
      }
      if (formData.password.length < 6) {
        setPasswordError(texts.passwordErrors.tooShort[language] || texts.passwordErrors.tooShort.az);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Password change is handled via a separate endpoint in API; skip here

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.surname) formDataToSend.append('surname', formData.surname);
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.phone) formDataToSend.append('phone', formData.phone);

      const response = await axios.post(
        'https://atfplatform.tw1.ru/api/profile/edit',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
            // NOTE: Do not set Content-Type; the browser will set multipart boundaries
          }
        }
      );

      if (response.data) {
        // Refresh user data after successful update
        await fetchUserData();

        toast.success(texts.toastMessages.updateSuccess[language] || texts.toastMessages.updateSuccess.az);
        setIsEditingProfile(false);

        // Clear password fields locally (not sent in this request)
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
        setAvatarFile(null);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        toast.error(texts.toastMessages.validationError[language] || texts.toastMessages.validationError.az);
      } else {
        // toast.error('Xəta baş verdi');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!validatePasswords(true)) return;

    setLoading(true);
    try {
      await axios.post(
        'https://atfplatform.tw1.ru/api/profile/password/edit',
        {
          old_password: formData.old_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );
      toast.success(texts.toastMessages.updateSuccess[language] || texts.toastMessages.updateSuccess.az);
      setFormData(prev => ({
        ...prev,
        old_password: '',
        password: '',
        password_confirmation: ''
      }));
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowOldPassword(false);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        toast.error(texts.toastMessages.validationError[language] || texts.toastMessages.validationError.az);
      }
    } finally {
      setLoading(false);
    }
  };

  // Advert update functions
  const updateAdvert = async (advertData, userType, advertSlug) => {
    const API_URL = `https://atfplatform.tw1.ru/api/adverts/update/${advertSlug}`;

    console.log("=== ADVERT UPDATE DEBUG ===");
    console.log("API URL:", API_URL);
    console.log("User Type:", userType);
    console.log("Advert Slug:", advertSlug);
    console.log("Full Advert Data:", advertData);

    // Create FormData object
    const formDataToSend = new FormData();

    if (userType === "individual") {
      // Individual form - only fill relevant fields, others null
      formDataToSend.append("capacity", advertData.capacity || "0");
      formDataToSend.append("unit_id", advertData.unit_id || "");
      formDataToSend.append("reach_from_address", advertData.reach_from_address || "");
      formDataToSend.append("empty_space", advertData.empty_space || "");
      formDataToSend.append("truck_type_id", advertData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", advertData.truck_registration_number || "");
      formDataToSend.append("from_id", advertData.from_id || "");
      formDataToSend.append("to_id", advertData.to_id || "");
      formDataToSend.append("expires_at", advertData.expires_at || "");
      formDataToSend.append("name_az", advertData.name_az || "");
      formDataToSend.append("name_en", advertData.name_en || "");
      formDataToSend.append("name_ru", advertData.name_ru || "");
      formDataToSend.append("load_type_az", advertData.load_type_az || "");
      formDataToSend.append("load_type_en", advertData.load_type_en || "");
      formDataToSend.append("load_type_ru", advertData.load_type_ru || "");
      formDataToSend.append("exit_from_address_az", advertData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address_en", advertData.exit_from_address_en || "");
      formDataToSend.append("exit_from_address_ru", advertData.exit_from_address_ru || "");
      formDataToSend.append("description_az", advertData.description_az || "");
      formDataToSend.append("description_en", advertData.description_en || "");
      formDataToSend.append("description_ru", advertData.description_ru || "");

      // Add photos
      advertData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });

      // Set null for fields not used in individual
      // Note: Don't append null values, just skip them for nullable fields

    } else if (userType === "legal_entity") {
      // Legal form - fill all fields
      formDataToSend.append("capacity", advertData.capacity || "0");
      formDataToSend.append("unit_id", advertData.unit_id || "");
      formDataToSend.append("reach_from_address", advertData.reach_from_address || "");
      formDataToSend.append("empty_space", advertData.empty_space || "");
      formDataToSend.append("truck_type_id", advertData.truck_type_id || "");
      formDataToSend.append("truck_registration_number", advertData.truck_registration_number || "");
      formDataToSend.append("from_id", advertData.from_id || "");
      formDataToSend.append("to_id", advertData.to_id || "");
      formDataToSend.append("expires_at", advertData.expires_at || "");
      formDataToSend.append("name_az", advertData.name_az || "");
      formDataToSend.append("name_en", advertData.name_en || "");
      formDataToSend.append("name_ru", advertData.name_ru || "");
      formDataToSend.append("load_type_az", advertData.load_type_az || "");
      formDataToSend.append("load_type_en", advertData.load_type_en || "");
      formDataToSend.append("load_type_ru", advertData.load_type_ru || "");
      formDataToSend.append("exit_from_address_az", advertData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address_en", advertData.exit_from_address_en || "");
      formDataToSend.append("exit_from_address_ru", advertData.exit_from_address_ru || "");
      formDataToSend.append("description_az", advertData.description_az || "");
      formDataToSend.append("description_en", advertData.description_en || "");
      formDataToSend.append("description_ru", advertData.description_ru || "");
      formDataToSend.append("driver_full_name_az", advertData.driver_full_name_az || "");
      formDataToSend.append("driver_biography_az", advertData.driver_biography_az || "");
      formDataToSend.append("driver_experience_az", advertData.driver_experience_az || "");

      // Add driver photo
      if (advertData.driver_photo) {
        formDataToSend.append("driver_photo", advertData.driver_photo);
      }

      // Add driver certificates
      advertData.driver_certificates.forEach((cert, index) => {
        formDataToSend.append("driver_certificates[]", cert);
      });

      // Add photos
      advertData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });

    } else if (userType === "entrepreneur") {
      // Entrepreneur form - only fill relevant fields, others null
      formDataToSend.append("capacity", advertData.capacity || "0");
      formDataToSend.append("unit_id", advertData.unit_id || "");
      formDataToSend.append("reach_from_address", advertData.reach_from_address || "");
      formDataToSend.append("truck_type_id", advertData.truck_type_id || "");
      formDataToSend.append("from_id", advertData.from_id || "");
      formDataToSend.append("to_id", advertData.to_id || "");
      formDataToSend.append("expires_at", advertData.expires_at || "");
      formDataToSend.append("name_az", advertData.name_az || "");
      formDataToSend.append("name_en", advertData.name_en || "");
      formDataToSend.append("name_ru", advertData.name_ru || "");
      formDataToSend.append("load_type_az", advertData.load_type_az || "");
      formDataToSend.append("load_type_en", advertData.load_type_en || "");
      formDataToSend.append("load_type_ru", advertData.load_type_ru || "");
      formDataToSend.append("exit_from_address_az", advertData.exit_from_address_az || "");
      formDataToSend.append("exit_from_address_en", advertData.exit_from_address_en || "");
      formDataToSend.append("exit_from_address_ru", advertData.exit_from_address_ru || "");
      formDataToSend.append("description_az", advertData.description_az || "");
      formDataToSend.append("description_en", advertData.description_en || "");
      formDataToSend.append("description_ru", advertData.description_ru || "");

      // Add photos
      advertData.photos.forEach((photo, index) => {
        formDataToSend.append("photos[]", photo);
      });

      // Set null for fields not used in entrepreneur
      // Note: Don't append null values, just skip them for nullable fields
    }

    // Validate required fields
    if (!advertData.capacity || advertData.capacity === "0") {
      toast.error("Tutum mütləq doldurulmalıdır");
      return;
    }

    if (!advertData.name_az || advertData.name_az.trim() === "") {
      toast.error("Elanın adı (AZ) mütləq doldurulmalıdır");
      return;
    }

    if (!advertData.load_type_az || advertData.load_type_az.trim() === "") {
      toast.error("Yük növü (AZ) mütləq doldurulmalıdır");
      return;
    }

    if (!advertData.exit_from_address_az || advertData.exit_from_address_az.trim() === "") {
      toast.error("Çıxış ünvanı (AZ) mütləq doldurulmalıdır");
      return;
    }

    if (!advertData.description_az || advertData.description_az.trim() === "") {
      toast.error("Təsvir (AZ) mütləq doldurulmalıdır");
      return;
    }

    // Log FormData contents
    console.log("=== FORMDATA CONTENTS ===");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("=== END FORMDATA ===");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      console.log("Response:", response);
      console.log("Response status:", response.data);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log("Advert updated successfully:", result);
        toast.success("Elan uğurla yeniləndi!");
        // Refresh user data to get updated adverts
        await fetchUserData();
        setIsEditingAdvert(null);
        setEditingAdvertData(null);
      } else {
        const error = await response.json();
        console.error("Error updating advert:", error);
        console.error("Response status:", response.status);
        console.error("Response text:", await response.text());
        toast.error("Xəta baş verdi: " + (error.message || "Naməlum xəta"));
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Şəbəkə xətası: " + error.message);
    }
  };

  // Branch update and delete functions
  const updateBranch = async (branchData, branchSlug) => {
    const API_URL = `https://atfplatform.tw1.ru/api/branches/${branchSlug}`;

    // Create FormData object
    const formDataToSend = new FormData();

    formDataToSend.append("name", branchData.name || "");
    formDataToSend.append("description", branchData.description || "");
    formDataToSend.append("status", branchData.status || "active");

    // Add photo if provided
    if (branchData.photo) {
      formDataToSend.append("photo", branchData.photo);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Branch updated successfully:", result);
        toast.success("Filial uğurla yeniləndi!");
        // Refresh user data to get updated branches
        await fetchUserData();
        setIsEditingBranch(null);
        setEditingBranchData(null);
      } else {
        const error = await response.json();
        console.error("Error updating branch:", error);
        toast.error("Xəta baş verdi: " + (error.message || "Naməlum xəta"));
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Şəbəkə xətası: " + error.message);
    }
  };

  const deleteBranch = async (branchSlug) => {
    const API_URL = `https://atfplatform.tw1.ru/api/branches/${branchSlug}`;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (response.ok) {
        toast.success("Filial uğurla silindi!");
        // Refresh user data to get updated branches
        await fetchUserData();
        setShowDeleteConfirm(null);
      } else {
        const error = await response.json();
        console.error("Error deleting branch:", error);
        toast.error("Xəta baş verdi: " + (error.message || "Naməlum xəta"));
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Şəbəkə xətası: " + error.message);
    }
  };

  const addBranch = async (branchData) => {
    const API_URL = 'https://atfplatform.tw1.ru/api/branches';

    // Create FormData object
    const formDataToSend = new FormData();

    formDataToSend.append("name", branchData.name || "");
    formDataToSend.append("description", branchData.description || "");
    formDataToSend.append("status", branchData.status || "active");

    // Add photo if provided
    if (branchData.photo) {
      formDataToSend.append("photo", branchData.photo);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Branch added successfully:", result);
        toast.success("Filial uğurla əlavə edildi!");
        // Refresh user data to get updated branches
        await fetchUserData();
        setShowAddBranchModal(false);
        setAddBranchData({
          name: '',
          description: '',
          status: 'active',
          photo: null
        });
      } else {
        const error = await response.json();
        console.error("Error adding branch:", error);
        toast.error("Xəta baş verdi: " + (error.message || "Naməlum xəta"));
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Şəbəkə xətası: " + error.message);
    }
  };

  // Initialize branch editing form
  const initializeBranchEdit = (branch) => {
    setEditingBranchData({
      name: branch.name?.az || "",
      description: branch.description?.az || "",
      status: branch.status || "active",
      photo: null,
    });
  };

  // Handle branch edit button click
  const handleEditBranch = (branch) => {
    console.log("Edit branch clicked:", branch);
    const branchId = branch.id || branch.slug; // Use slug as fallback if no id
    console.log("Setting isEditingBranch to:", branchId);
    setIsEditingBranch(branchId);
    initializeBranchEdit(branch);
    console.log("Branch edit initialized");
  };

  // Handle branch form submission
  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!editingBranchData) return;

    setIsSubmittingBranch(true);
    try {
      const branch = userData?.branches?.find(b => (b.id === isEditingBranch) || (b.slug === isEditingBranch));
      if (branch) {
        await updateBranch(editingBranchData, branch.slug);
      }
    } finally {
      setIsSubmittingBranch(false);
    }
  };

  // Handle branch form input changes
  const handleBranchInputChange = (field, value) => {
    setEditingBranchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle branch file changes
  const handleBranchFileChange = (field, files) => {
    setEditingBranchData(prev => ({
      ...prev,
      [field]: files[0],
    }));
  };

  // Handle add branch form submission
  const handleAddBranchSubmit = async (e) => {
    e.preventDefault();
    if (!addBranchData.name.trim()) {
      toast.error("Filialın adı mütləq doldurulmalıdır");
      return;
    }

    setIsSubmittingAddBranch(true);
    try {
      await addBranch(addBranchData);
    } finally {
      setIsSubmittingAddBranch(false);
    }
  };

  // Handle add branch form input changes
  const handleAddBranchInputChange = (field, value) => {
    setAddBranchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle add branch file changes
  const handleAddBranchFileChange = (field, files) => {
    setAddBranchData(prev => ({
      ...prev,
      [field]: files[0],
    }));
  };

  // Initialize advert editing form
  const initializeAdvertEdit = (advert) => {
    const baseData = {
      capacity: advert.capacity || "",
      unit_id: advert.unit_id || "",
      reach_from_address: advert.reach_from_address || "",
      photos: [],
      from_id: advert.from_id || "",
      to_id: advert.to_id || "",
      expires_at: advert.expires_at || "",
      name_az: advert.name?.az || "",
      name_en: advert.name?.en || "",
      name_ru: advert.name?.ru || "",
      load_type_az: advert.load_type?.az || "",
      load_type_en: advert.load_type?.en || "",
      load_type_ru: advert.load_type?.ru || "",
      exit_from_address_az: advert.exit_from_address?.az || "",
      exit_from_address_en: advert.exit_from_address?.en || "",
      exit_from_address_ru: advert.exit_from_address?.ru || "",
      description_az: advert.description?.az || "",
      description_en: advert.description?.en || "",
      description_ru: advert.description?.ru || "",
    };

    if (userData?.role === "individual") {
      setEditingAdvertData({
        ...baseData,
        empty_space: advert.empty_space || "",
        truck_type_id: advert.truck_type_id || "",
        truck_registration_number: advert.truck_registration_number || "",
      });
    } else if (userData?.role === "legal_entity") {
      setEditingAdvertData({
        ...baseData,
        empty_space: advert.empty_space || "",
        truck_type_id: advert.truck_type_id || "",
        truck_registration_number: advert.truck_registration_number || "",
        driver_full_name_az: advert.driver_full_name || "",
        driver_full_name_en: advert.driver_full_name || "",
        driver_full_name_ru: advert.driver_full_name || "",
        driver_biography_az: advert.driver_biography || "",
        driver_biography_en: advert.driver_biography || "",
        driver_biography_ru: advert.driver_biography || "",
        driver_experience_az: advert.driver_experience || "",
        driver_experience_en: advert.driver_experience || "",
        driver_experience_ru: advert.driver_experience || "",
        driver_photo: null,
        driver_certificates: [],
      });
    } else if (userData?.role === "entrepreneur") {
      setEditingAdvertData({
        ...baseData,
        truck_type_id: advert.truck_type_id || "",
      });
    }
  };

  // Handle advert edit button click
  const handleEditAdvert = (advert) => {
    setIsEditingAdvert(advert.id);
    initializeAdvertEdit(advert);
  };

  // Handle advert form submission
  const handleAdvertSubmit = async (e) => {
    e.preventDefault();
    if (!editingAdvertData) return;

    setIsSubmittingAdvert(true);
    try {
      const advert = userData?.adverts?.find(a => a.id === isEditingAdvert);
      if (advert) {
        await updateAdvert(editingAdvertData, userData?.role, advert.slug);
      }
    } finally {
      setIsSubmittingAdvert(false);
    }
  };

  // Handle advert form input changes
  const handleAdvertInputChange = (field, value) => {
    setEditingAdvertData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle advert file changes
  const handleAdvertFileChange = (field, files) => {
    if (field === "photos" || field === "driver_certificates") {
      setEditingAdvertData(prev => ({
        ...prev,
        [field]: [...prev[field], ...Array.from(files)],
      }));
    } else {
      setEditingAdvertData(prev => ({
        ...prev,
        [field]: files[0],
      }));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-303px)]">
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 min-h-[calc(100vh-303px)]">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col gap-y-[16px] md:gap-y-0 md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={userData?.avatar ? getPhotoUrl(userData.avatar) : DEFAULT_AVATAR}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {texts.title[language] || texts.title.az}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {texts.roleLabels[userData?.role]?.[language] || texts.roleLabels[userData?.role]?.az || ''}
                </p>
              </div>
            </div>

            {!isEditingProfile && (
              <motion.button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#2E92A0] to-[#267A85] text-white rounded-xl hover:from-[#267A85] hover:to-[#1E6A75] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {texts.edit[language] || texts.edit.az}
              </motion.button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <motion.div
                className="space-y-2 md:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IoPerson className="text-[#2E92A0]" />
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={avatarFile ? URL.createObjectURL(avatarFile) : (userData?.avatar ? getPhotoUrl(userData.avatar) : DEFAULT_AVATAR)}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                    />
                  </div> */}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!isEditingProfile}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0]);
                      } else {
                        setAvatarFile(null);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                  />
                </div>
              </motion.div>
              {/* First Name */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IoPerson className="text-[#2E92A0]" />
                  {texts.firstName[language] || texts.firstName.az}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                />
              </motion.div>

              {/* Last Name */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IoPerson className="text-[#2E92A0]" />
                  {texts.lastName[language] || texts.lastName.az}
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IoMail className="text-[#2E92A0]" />
                  {texts.email[language] || texts.email.az}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IoCall className="text-[#2E92A0]" />
                  {texts.phone[language] || texts.phone.az}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                  placeholder="+994-xx-xxx-xx-xx"
                />
              </motion.div>

              {/* Password fields - only show in edit mode */}
              {isEditingProfile && (
                <>
                  {/* Old Password (for password change) */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <IoLockClosed className="text-[#2E92A0]" />
                      Köhnə şifrə
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        name="old_password"
                        value={formData.old_password || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 hover:border-gray-300"
                        placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                      >
                        {showOldPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* New Password */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <IoLockClosed className="text-[#2E92A0]" />
                      {texts.newPassword[language] || texts.newPassword.az}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 hover:border-gray-300"
                        placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                      >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <IoLockClosed className="text-[#2E92A0]" />
                      {texts.confirmPassword[language] || texts.confirmPassword.az}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 hover:border-gray-300"
                        placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                      >
                        {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Password Error */}
            <AnimatePresence>
              {passwordError && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <span className="text-red-700 text-sm font-medium">
                    {passwordError}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <AnimatePresence mode="wait">
              {isEditingProfile ? (
                <motion.div
                  className="flex justify-end gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    type="button"
                    onClick={async () => {
                      setIsEditingProfile(false);
                      // Re-fetch user data to reset form
                      const userData = await fetchUserData();
                      if (userData) {
                        const formattedPhone = userData.phone ? formatPhoneNumber(userData.phone) : '';
                        setFormData({
                          name: userData.name || '',
                          surname: userData.surname || '',
                          email: userData.email || '',
                          phone: formattedPhone,
                          password: '',
                          password_confirmation: ''
                        });
                      }
                      setPasswordError('');
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setShowOldPassword(false);
                    }}
                    className="px-8 py-4 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {texts.cancel[language] || texts.cancel.az}
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-[#2E92A0] to-[#267A85] text-white rounded-xl hover:from-[#267A85] hover:to-[#1E6A75] transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {texts.updating[language] || texts.updating.az}
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircle size={20} />
                        Profili yadda saxla
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-[#6B7280] to-[#4B5563] text-white rounded-xl hover:from-[#4B5563] hover:to-[#374151] transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {texts.updating[language] || texts.updating.az}
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircle size={20} />
                        Şifrəni yenilə
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Separate Adverts Section */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IoCar className="text-[#2E92A0]" />
            {texts.adverts[language] || texts.adverts.az}
          </h3>

          {userData?.adverts && userData.adverts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.adverts.map((advert, index) => {
                // Determine the correct route based on user role
                const getAdvertRoute = (userRole, advertSlug) => {
                  switch (userRole) {
                    case 'individual':
                      return `/dasinma/fiziki-sexs-elanlari/${advertSlug}`;
                    case 'legal_entity':
                      return `/dasinma/huquqi-sexs-elanlari/${advertSlug}`;
                    case 'entrepreneur':
                      return `/dasinma/sahibkar-sexs-elanlari/${advertSlug}`;
                    default:
                      return `/dasinma/fiziki-sexs-elanlari/${advertSlug}`;
                  }
                };

                return (
                  <motion.div
                    key={advert.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#2E92A0] transition-all duration-300 relative cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {/* Clickable Link Wrapper */}
                    <Link
                      to={getAdvertRoute(userData?.role, advert.slug)}
                      className="block"
                      onClick={(e) => {
                        // Prevent navigation if clicking on edit button
                        if (e.target.closest('.edit-button')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-800 text-lg group-hover:text-[#2E92A0] transition-colors flex items-center justify-between">
                          <span>{advert.name?.[language] || advert.name?.az || 'Unnamed Advert'}</span>
                          <span className="text-xs text-gray-400 group-hover:text-[#2E92A0] transition-colors">
                            Bax →
                          </span>
                        </h4>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Yük növü:</span>
                            <span className="ml-2 font-medium">{advert.load_type?.[language] || advert.load_type?.az || '-'}</span>
                          </div>

                          <div>
                            <span className="text-gray-600">Tutum:</span>
                            <span className="ml-2 font-medium">{advert.capacity || '-'}</span>
                          </div>

                          <div>
                            <span className="text-gray-600">Haradan:</span>
                            <span className="ml-2 font-medium">{advert.exit_from_address?.[language] || advert.exit_from_address?.az || '-'}</span>
                          </div>

                          <div>
                            <span className="text-gray-600">Tarix:</span>
                            <span className="ml-2 font-medium">{advert.reach_from_address || '-'}</span>
                          </div>

                          {advert.truck_registration_number && (
                            <div>
                              <span className="text-gray-600">Tır nömrəsi:</span>
                              <span className="ml-2 font-medium">{advert.truck_registration_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Edit Icon - positioned outside the link */}
                    <div className="absolute top-4 right-4">
                      <button
                        className="edit-button p-2 text-gray-400 hover:text-[#2E92A0] transition-colors bg-white rounded-full shadow-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditAdvert(advert);
                        }}
                      >
                        <IoCreate size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <IoCar className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600">{texts.noAdverts[language] || texts.noAdverts.az}</p>
            </div>
          )}

          {/* Advert Edit Form */}
          {isEditingAdvert && editingAdvertData && (
            <motion.div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Elanı redaktə et</h3>
              <AdvertEditForm
                editingAdvertData={editingAdvertData}
                handleAdvertInputChange={handleAdvertInputChange}
                handleAdvertFileChange={handleAdvertFileChange}
                handleAdvertSubmit={handleAdvertSubmit}
                isSubmittingAdvert={isSubmittingAdvert}
                setIsEditingAdvert={setIsEditingAdvert}
                setEditingAdvertData={setEditingAdvertData}
                activeAdvertLangTab={activeAdvertLangTab}
                setActiveAdvertLangTab={setActiveAdvertLangTab}
                userData={userData}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Separate Branches Section (for Legal Entities) */}
        {userData?.role === 'legal_entity' && (
          <motion.div
            className="mt-8 bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <IoLocation className="text-[#2E92A0]" />
                {texts.branches[language] || texts.branches.az}
              </h3>
              {/* <motion.button
                type="button"
                onClick={() => setShowAddBranchModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#2E92A0] to-[#267A85] text-white rounded-lg hover:from-[#267A85] hover:to-[#1E6A75] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">+</span>
                <span className="text-sm font-medium">Filial əlavə et</span>
              </motion.button> */}
            </div>

            {userData?.branches && userData.branches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.branches.map((branch, index) => {
                  console.log("Branch data:", branch);
                  return (
                    <motion.div
                      key={branch.slug}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {/* Edit and Delete Icons */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-[#2E92A0] transition-colors bg-white rounded-full shadow-sm"
                          onClick={() => handleEditBranch(branch)}
                        >
                          <IoCreate size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
                          onClick={() => setShowDeleteConfirm(branch)}
                        >
                          <IoTrash size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {branch.photo && (
                          <div className="w-full h-36 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                            <img
                              src={getPhotoUrl(branch.photo)}
                              alt={branch.name?.[language] || branch.name?.az || 'Branch photo'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <h4 className="font-bold text-gray-800 text-lg">
                          {branch.name?.[language] || branch.name?.az || 'Unnamed Branch'}
                        </h4>

                        {branch.description && (
                          <p className="text-gray-600 text-sm">
                            {branch.description?.[language] || branch.description?.az}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <motion.div
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative flex justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setShowAddBranchModal(true)}
                >
                  <FaPlus className='text-[#2E92A0] h-5 w-5' />
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <IoLocation className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">{texts.noBranches[language] || texts.noBranches.az}</p>
              </div>
            )}

            {/* Branch Edit Modal */}
            {console.log("Branch edit form check:", { isEditingBranch, editingBranchData, userRole: userData?.role })}
            {isEditingBranch && editingBranchData && (
              <motion.div
                className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-[1002] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Filialı redaktə et</h3>

                  <form onSubmit={handleBranchSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Filialın adı
                        </label>
                        <input
                          type="text"
                          value={editingBranchData.name || ""}
                          onChange={(e) => handleBranchInputChange("name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                          placeholder="Filialın adı"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={editingBranchData.status || "active"}
                          onChange={(e) => handleBranchInputChange("status", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        >
                          <option value="active">Aktiv</option>
                          <option value="passive">Passiv</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Təsvir
                        </label>
                        <textarea
                          value={editingBranchData.description || ""}
                          onChange={(e) => handleBranchInputChange("description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                          rows={4}
                          placeholder="Filialın təsviri"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Şəkil
                        </label>
                        {(() => {
                          const branch = userData?.branches?.find(
                            (b) => b.id === isEditingBranch || b.slug === isEditingBranch
                          );
                          const photoUrl = getPhotoUrl(branch?.photo);
                          return photoUrl ? (
                            <div className="mb-3">
                              <div className="w-full h-36 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                                <img
                                  src={photoUrl}
                                  alt={branch?.name?.[language] || branch?.name?.az || 'Branch photo'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Mövcud şəkil</p>
                            </div>
                          ) : null;
                        })()}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBranchFileChange("photo", e.target.files)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        />
                        {editingBranchData.photo && (
                          <p className="text-sm text-gray-600 mt-1">
                            Seçilmiş: {editingBranchData.photo.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingBranch(null);
                          setEditingBranchData(null);
                        }}
                        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Ləğv et
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingBranch}
                        className="px-6 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingBranch ? "Yenilənir..." : "Yadda saxla"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-[1002]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Filialı sil</h3>
              <p className="text-gray-600 mb-6">
                "{showDeleteConfirm.name?.[language] || showDeleteConfirm.name?.az}" filialını silmək istədiyinizə əminsiniz?
                Bu əməliyyat geri alına bilməz.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={() => {
                    deleteBranch(showDeleteConfirm.slug);
                  }}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Branch Modal */}
        {showAddBranchModal && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-[1002] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <IoLocation className="text-[#2E92A0]" />
                Filial Əlavə Et
              </h3>

              <form onSubmit={handleAddBranchSubmit} className="space-y-6">
                {/* Image Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şəkil</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="add-branch-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAddBranchFileChange("photo", e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="add-branch-photo"
                      className="px-4 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors cursor-pointer"
                    >
                      Şəkil Seç
                    </label>
                    {addBranchData.photo && (
                      <button
                        type="button"
                        onClick={() => handleAddBranchFileChange("photo", [])}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Şəkli Silin
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {addBranchData.photo ? `Seçilmiş: ${addBranchData.photo.name}` : 'Şəkil seçilməyib'}
                  </p>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={addBranchData.status}
                    onChange={(e) => handleAddBranchInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                  >
                    <option value="active">Aktiv</option>
                    <option value="passive">Passiv</option>
                  </select>
                </div>

                {/* Single-language (AZ) only */}

                {/* Branch Name & Description per language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filial Adı</label>
                  <input
                    type="text"
                    value={addBranchData.name}
                    onChange={(e) => handleAddBranchInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                    placeholder="Filial Adı"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıqlama</label>
                  <textarea
                    value={addBranchData.description}
                    onChange={(e) => handleAddBranchInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                    rows={4}
                    placeholder="Açıqlama"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddBranchModal(false);
                      setAddBranchData({
                        name: '',
                        description: '',
                        status: 'active',
                        photo: null
                      });
                    }}
                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAddBranch}
                    className="px-6 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmittingAddBranch ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Əlavə edilir...
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircle size={16} />
                        Əlavə Et
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div >
  );
};

export default ProfilePage; 