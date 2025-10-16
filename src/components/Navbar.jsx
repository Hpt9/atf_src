import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import useLanguageStore from '../store/languageStore';
import { IoChevronDown } from "react-icons/io5";

const Navbar = ({ menuItems = [], isMenuLoading = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBar } = useSearchBar();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
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

  // Helper to check if a menu item or any of its children matches the current path
  const isMenuItemActive = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const itemUrl = item.url || '';
    const path = `/${itemUrl}`;

    // Special handling for items with empty url
    if (itemUrl === '') {
      // If this is a parent/group (e.g., Daşınma) with children, it's active only when a child is active
      if (hasChildren) {
        return item.children.some(isMenuItemActive);
      }
      // Otherwise, this represents the homepage item
      return location.pathname === '/';
    }

    // Check exact match for non-empty urls
    if (location.pathname === path) {
      return true;
    }

    // Check if current path starts with the menu item path (for nested routes)
    if (location.pathname.startsWith(`${path}/`)) {
      return true;
    }

    // Check children recursively
    if (hasChildren) {
      return item.children.some(isMenuItemActive);
    }

    return false;
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-dropdown-parent')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  const hasChildren = item.children && item.children.length > 0;
                  const isActive = isMenuItemActive(item);
                  if (hasChildren) {
                    return (
                      <div key={item.id} className="navbar-dropdown-parent relative inline-block">
                        <button
                          className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative flex items-center gap-1 ${
                            isActive ? 'text-[#2E92A0]' : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                          }`}
                          type="button"
                          style={{ background: 'none', border: 'none', padding: 0 }}
                          onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                          aria-expanded={openDropdownId === item.id}
                        >
                          {item.title[language] || item.title.az}
                          <IoChevronDown className="ml-1 text-[16px] relative top-[2px] transition-transform duration-200" style={{ transform: openDropdownId === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                          {isActive && (
                            <motion.span
                              className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                              layoutId="underline"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                        <AnimatePresence>
                        {openDropdownId === item.id && (
                          <div className="absolute left-0 top-full mt-2 z-50 transition-opacity duration-200"
                            style={{ minWidth: '170px' }}
                          >
                            <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white border border-[#D1D5DB] rounded-[12px] flex flex-col gap-y-[12px] p-[16px]" style={{ boxShadow: 'none' }}>
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  to={`/${child.url}`}
                                  className="text-[14px] font-medium text-[#3F3F3F] hover:text-[#2E92A0] hover:bg-gray-50 rounded transition-colors"
                                  onClick={() => setOpenDropdownId(null)}
                                >
                                  {child.title[language] || child.title.az}
                                </Link>
                              ))}
                            </motion.div>
                          </div>
                        )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  // Normal link
                  return (
                    <Link
                      key={item.id}
                      to={item.url === '' ? '/' : path}
                      className={`text-[14px] font-medium transition-all duration-150 cursor-pointer relative ${
                        isActive ? 'text-[#2E92A0]' : 'text-[#3F3F3F] hover:text-[#2E92A0]'
                      }`}
                    >
                      {item.title[language] || item.title.az}
                      {isActive && (
                        <motion.span
                          className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2E92A0]"
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
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
