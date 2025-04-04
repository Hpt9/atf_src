import React from "react";
import { Link, useLocation } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'

const Navbar = () => {
  const location = useLocation();
  const { searchBar } = useSearchBar();
  
  return (
    <header className=" text-white md:px-[32px] lg:px-[50px] xl:px-[108px] py-[20px] border-t border-[#FAFAFA] bg-white h-[83px] hidden md:flex items-center">
      <nav className=" w-full">
        <div className="flex items-center justify-between">
          <div className=" items-center space-x-8">
            <Link 
              to="/" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              Ana səhifə
            </Link>
            <Link 
              to="/hs-codes" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/hs-codes' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              Hs Kodlar
            </Link>
            <Link 
              to="/icazeler" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/icazeler' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              İcazələr
            </Link>
            <Link 
              to="/muracietler" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/muracietler' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              Müraciətlər
            </Link>
            <Link 
              to="/faq" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/faq' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/elaqe" 
              className={`text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                location.pathname === '/elaqe' 
                  ? 'text-[#2E92A0]' 
                  : 'text-[#3F3F3F] hover:text-[#2E92A0]'
              }`}
            >
              Əlaqə
            </Link>
          </div>
          
          {/* Dynamic Search Bar */}
          {searchBar}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
