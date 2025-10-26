import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import useLanguageStore from '../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPerson, IoMail, IoCall, IoLockClosed, IoEye, IoEyeOff, IoCheckmarkCircle, IoBusiness, IoCar, IoLocation, IoCreate, IoTrash } from 'react-icons/io5';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAdvert, setIsEditingAdvert] = useState(null); // null or advert ID
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [userData, setUserData] = useState(null);
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2E92A0] to-[#267A85] rounded-full flex items-center justify-center">
                {userData?.role === 'legal_entity' ? <IoBusiness className="text-white text-xl" /> : 
                 userData?.role === 'entrepreneur' ? <IoPerson className="text-white text-xl" /> : 
                 <IoCar className="text-white text-xl" />}
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
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                    placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                  />
                  {isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                    >
                      {showOldPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                  )}
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
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                    placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                  />
                  {isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                    >
                      {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                  )}
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
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                    placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                  />
                  {isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E92A0] transition-colors"
                    >
                      {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                  )}
                </div>
              </motion.div>
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
                            <span className="text-gray-600">Load Type:</span>
                            <span className="ml-2 font-medium">{advert.load_type?.[language] || advert.load_type?.az || '-'}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Capacity:</span>
                            <span className="ml-2 font-medium">{advert.capacity || '-'}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">From:</span>
                            <span className="ml-2 font-medium">{advert.exit_from_address?.[language] || advert.exit_from_address?.az || '-'}</span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <span className="ml-2 font-medium">{advert.reach_from_address || '-'}</span>
                          </div>
                          
                          {advert.truck_registration_number && (
                            <div>
                              <span className="text-gray-600">Truck No:</span>
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
                          setIsEditingAdvert(advert.id);
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
          {isEditingAdvert && (
            <motion.div 
              className="mt-6 bg-blue-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Elanı redaktə et</h3>
              <p className="text-sm text-gray-600 mb-4">
                Elan redaktə funksiyası tezliklə əlavə ediləcək
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingAdvert(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bağla
                </button>
              </div>
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
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IoLocation className="text-[#2E92A0]" />
              {texts.branches[language] || texts.branches.az}
            </h3>
            
            {userData?.branches && userData.branches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.branches.map((branch, index) => (
                  <motion.div
                    key={branch.slug}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {/* Edit Icon */}
                    <div className="absolute top-4 right-4">
                      <button 
                        className="p-2 text-gray-400 hover:text-[#2E92A0] transition-colors"
                        onClick={() => console.log('Edit branch:', branch.slug)}
                      >
                        <IoCreate size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <IoLocation className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">{texts.noBranches[language] || texts.noBranches.az}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 