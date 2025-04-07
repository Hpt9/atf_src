import React from "react";
import { Link, useLocation } from 'react-router-dom'
import { useSearchBar } from '../context/SearchBarContext'
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const { searchBar } = useSearchBar();
  
  return (
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
  );
};

export default Navbar;
