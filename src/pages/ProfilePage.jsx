import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
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
    } catch (error) {
      toast.error('Məlumatları yükləmək mümkün olmadı');
      navigate('/giris?type=login');
    }
  }, [navigate]);

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
        setPasswordError('Şifrələr eyni deyil');
        return false;
      }
      if (formData.password.length < 6) {
        setPasswordError('Şifrə ən azı 6 simvol olmalıdır');
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
        
        toast.success('Məlumatlarınız uğurla yeniləndi');
        setIsEditing(false);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-[#3F3F3F] mb-6">Profil məlumatları</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">Ad</label>
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
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">Soyad</label>
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
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">E-poçt</label>
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
                <label className="block text-sm font-medium text-[#3F3F3F] mb-2">Telefon</label>
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
                    <label className="block text-sm font-medium text-[#3F3F3F] mb-2">Yeni şifrə</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                      placeholder="Boş buraxsanız dəyişilməyəcək"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3F3F3F] mb-2">Yeni şifrəni təsdiqlə</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange} 
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-[#E7E7E7] focus:border-[#2E92A0] outline-none transition-colors disabled:bg-gray-50"
                      placeholder="Boş buraxsanız dəyişilməyəcək"
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
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Yenilənir...' : 'Yadda saxla'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
                >
                  Redaktə et
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