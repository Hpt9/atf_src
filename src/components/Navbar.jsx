import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBar } = useSearchBar();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleMuracietlerClick = (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
    } else if (!user.phone) {
      toast.error('Zəhmət olmasa, telefon nömrənizi əlavə edin', {
        duration: 3000,
      });
      navigate('/profile');
    } else {
      navigate('/muracietler');
    }
  };

  return (
    <>
      <header className=" text-white md:px-[32px] lg:px-[50px] xl:px-[108px] py-[20px] border-t border-[#FAFAFA] bg-white h-[83px] hidden md:flex items-center">
        <nav className=" w-full">
          <div className="flex items-center justify-between">
            <div className=" items-center space-x-4 lg:space-x-8 flex relative">
              <Link 
                to="/" 
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                Ana səhifə
                {location.pathname === '/' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
              <Link 
                to="/hs-codes" 
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/hs-codes' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                Hs Kodlar
                {location.pathname === '/hs-codes' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
              <Link 
                to="/icazeler" 
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/icazeler' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                İcazələr
                {location.pathname === '/icazeler' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
              <Link 
                to="/muracietler" 
                onClick={handleMuracietlerClick}
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/muracietler' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                Müraciətlər
                {location.pathname === '/muracietler' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
              <Link 
                to="/faq" 
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/faq' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                FAQ
                {location.pathname === '/faq' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
              <Link 
                to="/elaqe" 
                className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                  location.pathname === '/elaqe' 
                    ? 'text-[#2E92A0]' 
                    : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                }`}
              >
                Əlaqə
                {location.pathname === '/elaqe' && 
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                }
              </Link>
            </div>
            
            {/* Dynamic Search Bar */}
            {searchBar}
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0000003c] bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-semibold text-[#3F3F3F] mb-4">Daxil olun</h2>
              <p className="text-[#3F3F3F] mb-6">Müraciətlər bölməsinə daxil olmaq üçün hesabınıza giriş etməlisiniz.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-[#3F3F3F] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/giris?type=login');
                  }}
                  className="px-4 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
                >
                  Daxil ol
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
