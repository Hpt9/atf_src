import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import useLanguageStore from '../store/languageStore';

const Navbar = ({ menuItems = [], isMenuLoading = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBar } = useSearchBar();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleMuracietlerClick = (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
    } else if (!user.phone) {
      toast.error(
        language === 'az' ? 'Zəhmət olmasa, telefon nömrənizi əlavə edin' :
        language === 'en' ? 'Please add your phone number' :
        'Пожалуйста, добавьте свой номер телефона',
        { duration: 3000 }
      );
      navigate('/profile');
    } else {
      navigate('/muracietler');
    }
  };

  // Don't render loading state once we have menu items
  const shouldShowMenuItems = !isMenuLoading || menuItems.length > 0;

  return (
    <>
      <header className="text-white md:px-[32px] lg:px-[50px] xl:px-[108px] py-[20px] border-t border-[#FAFAFA] bg-white h-[83px] hidden md:flex items-center">
        <nav className="w-full">
          <div className="flex items-center justify-between">
            <div className="items-center space-x-4 lg:space-x-8 flex relative">
              {!shouldShowMenuItems ? (
                <div className="text-[14px] text-[#696969]">
                  {language === 'az' ? "Yüklənir..." : language === 'en' ? "Loading..." : "Загрузка..."}
                </div>
              ) : (
                menuItems.map((item) => {
                  const path = `/${item.url}`;
                  const isActive = location.pathname === path || 
                                 (location.pathname === '/' && item.url === '');
                  
                  // Special handling for muracietler path
                  if (item.url === 'muracietler') {
                    return (
                      <Link 
                        key={item.id}
                        to={path}
                        onClick={handleMuracietlerClick}
                        className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                          isActive 
                            ? 'text-[#2E92A0]' 
                            : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                        }`}
                      >
                        {item.title[language] || item.title.az}
                        {isActive && 
                          <motion.span 
                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                            layoutId="underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        }
                      </Link>
                    );
                  }
                  
                  return (
                    <Link 
                      key={item.id}
                      to={item.url === '' ? '/' : path}
                      className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                        isActive 
                          ? 'text-[#2E92A0]' 
                          : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                      }`}
                    >
                      {item.title[language] || item.title.az}
                      {isActive && 
                        <motion.span 
                          className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      }
                    </Link>
                  );
                })
              )}
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
              <h2 className="text-xl font-semibold text-[#3F3F3F] mb-4">
                {language === 'az' ? 'Daxil olun' : 
                 language === 'en' ? 'Log in' : 
                 'Войдите в систему'}
              </h2>
              <p className="text-[#3F3F3F] mb-6">
                {language === 'az' ? 'Müraciətlər bölməsinə daxil olmaq üçün hesabınıza giriş etməlisiniz.' : 
                 language === 'en' ? 'You need to log in to your account to access the Requests section.' : 
                 'Вам необходимо войти в систему, чтобы получить доступ к разделу Апелляции.'}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-[#3F3F3F] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {language === 'az' ? 'Ləğv et' : 
                   language === 'en' ? 'Cancel' : 
                   'Отмена'}
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/giris?type=login');
                  }}
                  className="px-4 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
                >
                  {language === 'az' ? 'Daxil ol' : 
                   language === 'en' ? 'Log in' : 
                   'Войти'}
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
