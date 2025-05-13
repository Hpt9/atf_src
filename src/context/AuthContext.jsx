import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // const checkToken = async (storedToken) => {
  //   try {
  //     const response = await axios.get('https://atfplatform.tw1.ru/api/user', {
  //       headers: {
  //         'Authorization': `Bearer ${storedToken}`
  //       }
  //     });
      
  //     if (response.data) {
  //       // Update user data from the server
  //       setUser(response.data);
  //       localStorage.setItem('user', JSON.stringify(response.data));
  //       setToken(storedToken);
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     // Only clear data if we get a 401 (Unauthorized) error
  //     if (error.response && error.response.status === 401) {
  //       console.error('Token is invalid');
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //       setUser(null);
  //       setToken(null);
  //     }
  //     return false;
  //   }
  // };

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
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Set the stored data immediately
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        
        // Check email verification status
        checkEmailVerification(userData);
        
        // Then validate the token in the background
        //await checkToken(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    // Show email verification notification for new logins
    if (userData && userData.email_verified_at === null) {
      // Email not verified - show toast notification
      toast.error('Zəhmət olmasa e-poçt ünvanınızı təsdiq edin', {
        duration: 5000,
        position: 'top-right',
        id: 'email-verification-reminder',
      });
    }
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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