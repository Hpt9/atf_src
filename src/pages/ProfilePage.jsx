import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useLanguageStore from '../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPerson, IoMail, IoCall, IoLockClosed, IoEye, IoEyeOff, IoCheckmarkCircle } from 'react-icons/io5';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      return response.data;
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

  const validatePasswords = () => {
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
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const dataToSend = { ...formData };
      
      // Only include password fields if they are filled
      if (!dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }

      const response = await axios.post(
        'https://atfplatform.tw1.ru/api/profile/edit',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Refresh user data after successful update
        await fetchUserData();
        
        toast.success(texts.toastMessages.updateSuccess[language] || texts.toastMessages.updateSuccess.az);
        setIsEditing(false);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
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
                <IoPerson className="text-white text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {texts.title[language] || texts.title.az}
              </h1>
            </div>
            
            {!isEditing && (
              <motion.button
                type="button"
                onClick={() => setIsEditing(true)}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                  placeholder="+994-xx-xxx-xx-xx"
                />
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
                    disabled={!isEditing}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                    placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                  />
                  {isEditing && (
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
                    disabled={!isEditing}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#2E92A0] outline-none transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                    placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                  />
                  {isEditing && (
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
              {isEditing ? (
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
                      setIsEditing(false);
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
                        {texts.save[language] || texts.save.az}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 