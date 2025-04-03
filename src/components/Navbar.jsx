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
            <Link to="/" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/' ? 'font-medium' : ''}`}>
              Ana səhifə
            </Link>
            <Link to="/hs-codes" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/hs-codes' ? 'font-medium' : ''}`}>
              Hs Kodlar
            </Link>
            <Link to="/icazeler" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/icazeler' ? 'font-medium' : ''}`}>
              İcazələr
            </Link>
            <Link to="/muracietler" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/muracietler' ? 'font-medium' : ''}`}>
              Müraciətlər
            </Link>
            <Link to="/faq" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/faq' ? 'font-medium' : ''}`}>
              FAQ
            </Link>
            <Link to="/elaqe" className={`text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150 cursor-pointer ${location.pathname === '/elaqe' ? 'font-medium' : ''}`}>
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
