import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRouteGuard = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/giris" />;
  }
  
  // Check if the username is 'Admin'
  const isAdmin = user.name === 'Admin';
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRouteGuard; 