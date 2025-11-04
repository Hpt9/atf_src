import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setTokenCookie, getTokenCookie, removeTokenCookie } from '../utils/cookieUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (authToken) => {
    try {
      const response = await axios.get('https://atfplatform.tw1.ru/api/user', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.data) {
        const userPayload = response.data?.data || null;
        if (userPayload) {
          setUser(userPayload);
        }
        return userPayload;
      }
      return null;
    } catch (error) {
      // Only clear data if we get a 401 (Unauthorized) error
      if (error.response && error.response.status === 401) {
        console.error('Token is invalid');
        removeTokenCookie();
        setUser(null);
        setToken(null);
      }
      return null;
    }
  };

  // Check if email is verified and show toast if not
  const checkEmailVerification = (userData) => {
    if (userData && userData.email_verified_at === null) {
      // Email not verified - show toast notification
      toast.error('Zəhmət olmasa e-poçt ünvanınızı təsdiq edin', {
        duration: 5000,
        position: 'top-right',
        id: 'email-verification-reminder',
      });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getTokenCookie();
      
      if (storedToken) {
        setToken(storedToken);
        
        // Fetch user data from API
        const userData = await fetchUserData(storedToken);
        
        if (userData) {
          // Check email verification status
          checkEmailVerification(userData);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userToken) => {
    setToken(userToken);
    setTokenCookie(userToken);
    
    // Fetch user data after login
    const userData = await fetchUserData(userToken);
    
    // Show email verification notification if needed
    if (userData && userData.email_verified_at === null) {
      toast.error('Zəhmət olmasa e-poçt ünvanınızı təsdiq edin', {
        duration: 5000,
        position: 'top-right',
        id: 'email-verification-reminder',
      });
    }
    
    return userData;
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('https://atfplatform.tw1.ru/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API success/failure
      setUser(null);
      setToken(null);
      removeTokenCookie();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#2E92A0] border-t-transparent rounded-full animate-spin" aria-label="Yüklənir" />
          <div className="text-[#3F3F3F] text-sm">Yüklənir...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 