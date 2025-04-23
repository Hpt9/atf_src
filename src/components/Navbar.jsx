import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';

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

      {/* Login Confirmation Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            className="fixed inset-0 bg-[#0000003e] flex items-center justify-center z-[10001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-[#3F3F3F] mb-4">
                Müraciətlər səhifəsinə baxmaq üçün daxil olmalısınız. Daxil olmaq istəyirsiniz?
              </h3>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/');
                  }}
                  className="px-4 py-2 text-[#3F3F3F] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Xeyr
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/giris?type=login');
                  }}
                  className="px-4 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
                >
                  Bəli
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
