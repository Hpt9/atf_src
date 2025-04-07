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
          <div className=" items-center space-x-8 flex">
            <div className="relative">
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
              {location.pathname === '/' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
            
            <div className="relative">
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
              {location.pathname === '/hs-codes' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
            
            <div className="relative">
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
              {location.pathname === '/icazeler' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
            
            <div className="relative">
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
              {location.pathname === '/muracietler' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
            
            <div className="relative">
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
              {location.pathname === '/faq' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
            
            <div className="relative">
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
              {location.pathname === '/elaqe' && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-[#2E92A0]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30 
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Dynamic Search Bar */}
          {searchBar}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
