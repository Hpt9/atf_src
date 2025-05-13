import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useLanguageStore from '../store/languageStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { language } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/giris?type=login');
        return;
      }

      setFormData({
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '',
        password_confirmation: ''
      });
    } catch {
      toast.error(texts.toastMessages.loadError[language] || texts.toastMessages.loadError.az);
      navigate('/giris?type=login');
    }
  }, [navigate, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      const token = localStorage.getItem('token');
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
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        // Update local storage with new user data
        const updatedUserData = {
          ...JSON.parse(localStorage.getItem('user')),
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        // Update auth context
        setUser(updatedUserData);
        
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
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
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
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
                    onClick={() => {
                      setIsEditing(false);
                      const userData = JSON.parse(localStorage.getItem('user'));
                      setFormData({
                        name: userData?.name || '',
                        surname: userData?.surname || '',
                        email: userData?.email || '',
                        phone: userData?.phone || '',
                        password: '',
                        password_confirmation: ''
                      });
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