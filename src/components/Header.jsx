import { useState, useEffect } from "react";
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
const Header = () => {
  const navigate = useNavigate();
  const { searchBar } = useSearchBar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  return (
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
          <div className="hidden md:flex gap-4">
            {/* <select className="bg-transparent border-none outline-none cursor-pointer">
              <option value="az">AZ</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select> */}
            <button 
              className="px-4 py-[10px] font-semibold text-[#2E92A0] hover:text-[white] rounded-[8px] bg-white hover:bg-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer"
              onClick={() => navigate("/giris?type=register")}
            >
              Qeydiyyat
            </button>
            <button 
              className="px-6 py-[10px] bg-[#2E92A0] font-semibold text-white rounded-[8px] hover:bg-[white] hover:text-[#2E92A0] transition-colors border border-[#2E92A0] hover:cursor-pointer"
              onClick={() => navigate("/giris?type=login")}
            >
              Daxil ol
            </button>
          </div>
          <div className="flex md:hidden gap-x-[8px]">
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
          <div className="fixed inset-0 bg-white z-50 mt-[118px] md:hidden">
            <div className="flex flex-col p-4">
              <div className="flex gap-4 justify-between mb-4">
                {/* <select className="bg-transparent border-none outline-none cursor-pointer">
                  <option value="az">AZ</option>
                  <option value="en">EN</option>
                  <option value="ru">RU</option>
                </select> */}
                <div className="flex gap-x-[8px] w-full">
                  <button 
                    className="px-4 py-[10px] w-[50%] font-semibold text-[#2E92A0] rounded-[8px] bg-white hover:bg-[#2E92A0] hover:text-white transition-colors border border-[#2E92A0]"
                    onClick={() => navigate("/giris?type=register")}
                  >
                    Qeydiyyat
                  </button>
                  <button 
                    className="px-6 py-[10px] w-[50%] font-semibold bg-[#2E92A0] text-white rounded-[8px] hover:bg-white hover:text-[#2E92A0] transition-colors border border-[#2E92A0]"
                    onClick={() => navigate("/giris?type=login")}
                  >
                    Daxil ol
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ümumi axtarış"
                    className="w-full px-4 py-3 border border-[#E7E7E7] rounded-lg outline-none focus:border-[#2E92A0] transition-colors"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                        stroke="#3F3F3F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 21L16.65 16.65"
                        stroke="#3F3F3F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <Link
                  to="/"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ana səhifə
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
                <Link
                  to="/hs-codes"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HS Kodlar
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
                <Link
                  to="/icazeler"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  İcazələr
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
                <Link
                  to="/muracietler"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Müraciətlər
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
                <Link
                  to="/elaqe"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Əlaqə
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
                <Link
                  to="/faq"
                  className="py-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center text-[#3F3F3F] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                  <FaArrowRight className="w-[24px] h-[24px]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <Navbar />
        <div className="flex md:hidden bg-white">{searchBar}</div>
      </div>
    </div>
  );
};

export default Header;
