import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import ATF_LOGO from "../assets/icons/atf_logo.svg";
import ATF_LOGO_MOBIL from "../assets/icons/Logomobil.svg";
import { useSearchBar } from "../context/SearchBarContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import useLanguageStore from "../store/languageStore";

const Header = () => {
  const navigate = useNavigate();
  const { searchBar } = useSearchBar();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileLanguageDropdown, setShowMobileLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef(null);
  const mobileLanguageDropdownRef = useRef(null);
  const { language, setLanguage } = useLanguageStore();

  const languages = [
    { code: 'az', label: 'AZ' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (mobileLanguageDropdownRef.current && !mobileLanguageDropdownRef.current.contains(event.target)) {
        setShowMobileLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, showLogoutModal]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
    setShowMobileLanguageDropdown(false);
  };

  const navigationLinks = [
    { path: "/", label: "Ana səhifə" },
    { path: "/hs-codes", label: "HS Kodlar" },
    { path: "/icazeler", label: "İcazələr" },
    { path: "/muracietler", label: "Müraciətlər" },
    { path: "/elaqe", label: "Əlaqə" },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <div className="w-full flex justify-center sticky top-0 z-[1000] bg-white">
        <div className="w-full max-w-[2136px] flex flex-col ">
          <div className="login w-full h-[118px] bg-white flex justify-between items-center px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-[20px]">
            <img
              src={ATF_LOGO}
              alt="ATF LOGO"
              className="w-[94px] h-[78px] hidden md:flex hover:cursor-pointer"
              onClick={() => navigate("/")}
            />
            <img
              src={ATF_LOGO_MOBIL}
              alt="ATF LOGO"
              className="w-[150px] flex md:hidden hover:cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div className="hidden md:flex items-center gap-4">
              {/* Language Dropdown - Desktop */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-1 px-3 py-2 text-[#3F3F3F] hover:text-[#2E92A0] transition-colors"
                >
                  <span className="uppercase">{language}</span>
                  <IoChevronDown className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E7E7E7] rounded-lg shadow-lg py-2 min-w-[120px] z-[100]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#F5F5F5] transition-colors ${
                          language === lang.code ? 'text-[#2E92A0] font-medium' : 'text-[#3F3F3F]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <IoPersonCircleOutline size={24} className="text-[#2E92A0]" />
                    <span className="text-[#3F3F3F]">{user.name} {user.surname}</span>
                  </div>
                  <button 
                    onClick={handleLogoutClick}
                    className="px-4 py-[10px] font-semibold text-[#2E92A0] hover:text-white rounded-[8px] bg-white hover:bg-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer flex items-center gap-2"
                  >
                    <IoLogOutOutline size={20} />
                    Çıxış
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    className="px-4 py-[10px] font-semibold text-[#2E92A0] hover:text-[white] rounded-[8px] bg-white hover:bg-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer"
                    onClick={() => navigate("/giris?type=register")}
                  >
                    {language === 'az' ? 'Qeydiyyat' : language === 'en' ? 'Register' : 'Регистрация'}
                  </button>
                  <button 
                    className="px-6 py-[10px] bg-[#2E92A0] font-semibold text-white rounded-[8px] hover:bg-[white] hover:text-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer"
                    onClick={() => navigate("/giris?type=login")}
                  >
                    {language === 'az' ? 'Daxil ol' : language === 'en' ? 'Login' : 'Войти'}
                  </button>
                </>
              )}
            </div>
            <div className="flex md:hidden gap-x-[8px]">
              {/* Language Dropdown - Mobile */}
              <div className="relative" ref={mobileLanguageDropdownRef}>
                <button
                  onClick={() => setShowMobileLanguageDropdown(!showMobileLanguageDropdown)}
                  className="w-[44px] h-[44px] flex justify-center items-center border border-[#E7E7E7] bg-[#FAFAFA] rounded-[8px]"
                >
                  <span className="uppercase text-[#3F3F3F]">{language}</span>
                </button>
                {showMobileLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E7E7E7] rounded-lg shadow-lg py-2 min-w-[120px] z-[100]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#F5F5F5] transition-colors ${
                          language === lang.code ? 'text-[#2E92A0] font-medium' : 'text-[#3F3F3F]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="w-[44px] h-[44px] flex justify-center items-center border border-[#E7E7E7] bg-[#FAFAFA] rounded-[8px] relative cursor-pointer"
                onClick={openMobileMenu}
              >
                <LuSearch className="w-[24px] h-[24px]" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="flex md:hidden w-[44px] h-[44px] justify-center items-center border border-[#E7E7E7] bg-[#FAFAFA] rounded-[8px] relative cursor-pointer"
              >
                <IoClose
                  className={`w-[24px] h-[24px] absolute transition-all duration-200 ease-in-out ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-90"
                  }`}
                />
                <RxHamburgerMenu
                  className={`w-[24px] h-[24px] absolute transition-all duration-200 ease-in-out ${
                    isMobileMenuOpen
                      ? "opacity-0 -rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-white z-50 mt-[118px] md:hidden overflow-y-auto">
              <div className="flex flex-col p-4">
                {/* Auth Section */}
                {user ? (
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center gap-2 p-2">
                      <IoPersonCircleOutline size={24} className="text-[#2E92A0]" />
                      <div className="flex flex-col">
                        <span className="text-[#3F3F3F] font-medium">{user.name} {user.surname}</span>
                        <span className="text-[#696969] text-sm">+{user.phone}</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-[10px] font-semibold text-[#2E92A0] hover:text-white rounded-[8px] bg-white hover:bg-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer flex items-center justify-center gap-2"
                    >
                      <IoLogOutOutline size={20} />
                      Çıxış
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-x-[8px] w-full mb-4">
                    <button 
                      className="px-4 py-[10px] w-[50%] font-semibold text-[#2E92A0] rounded-[8px] bg-white hover:bg-[#2E92A0] hover:text-white transition-colors border border-[#2E92A0]"
                      onClick={() => {
                        navigate("/giris?type=register");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {language === 'az' ? 'Qeydiyyat' : language === 'en' ? 'Register' : 'Регистрация'}
                    </button>
                    <button 
                      className="px-6 py-[10px] w-[50%] font-semibold bg-[#2E92A0] text-white rounded-[8px] hover:bg-white hover:text-[#2E92A0] transition-colors border border-[#2E92A0]"
                      onClick={() => {
                        navigate("/giris?type=login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {language === 'az' ? 'Daxil ol' : language === 'en' ? 'Login' : 'Войти'}
                    </button>
                  </div>
                )}

                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ümumi axtarış"
                      className="w-full px-4 py-3 border border-[#E7E7E7] rounded-lg outline-none focus:border-[#2E92A0] transition-colors"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2">
                      <LuSearch className="w-[24px] h-[24px] text-[#3F3F3F]" />
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                      <FaArrowRight className="w-[24px] h-[24px]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Navbar />
          <div className="flex md:hidden bg-white">{searchBar}</div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
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
              <h3 className="text-lg font-semibold text-[#3F3F3F] mb-4">Çıxış etmək istədiyinizə əminsiniz?</h3>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-[#3F3F3F] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Xeyr
                </button>
                <button
                  onClick={handleLogout}
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

export default Header;
