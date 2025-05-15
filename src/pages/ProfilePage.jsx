import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useLanguageStore from '../store/languageStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    return <div className="flex justify-center items-center min-h-[calc(100vh-303px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
    </div>;
  }

  return (
    <div className="bg-gray-50 py-8 min-h-[calc(100vh-303px)]">
      <div className="max-w-3xl mx-auto my-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-[#3F3F3F] mb-6">{texts.title[language] || texts.title.az}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.firstName[language] || texts.firstName.az}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.lastName[language] || texts.lastName.az}</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.email[language] || texts.email.az}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] bg-gray-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.phone[language] || texts.phone.az}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                  placeholder="+994-xx-xxx-xx-xx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.newPassword[language] || texts.newPassword.az}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                  placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">{texts.confirmPassword[language] || texts.confirmPassword.az}</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange} 
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                  placeholder={texts.passwordPlaceholder[language] || texts.passwordPlaceholder.az}
                />
              </div>
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm mt-2">
                {passwordError}
              </div>
            )}

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
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
                    }}
                    className="px-6 py-3 text-[#3F3F3F] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {texts.cancel[language] || texts.cancel.az}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? (texts.updating[language] || texts.updating.az) : (texts.save[language] || texts.save.az)}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
                >
                  {texts.edit[language] || texts.edit.az}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 