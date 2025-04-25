import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const RouteGuard = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user is logged in and has a phone number
  if (!user) {
    return <Navigate to="/giris?type=login" />;
  }

  // If user is logged in but doesn't have a phone number
  if (!user.phone) {
    // Only show toast if not already on the profile page
    if (location.pathname !== '/profile') {
      toast.error('Zəhmət olmasa, telefon nömrənizi əlavə edin', {
        duration: 3000,
      });
    }
    return <Navigate to="/profile" />;
  }

  return children;
}; 