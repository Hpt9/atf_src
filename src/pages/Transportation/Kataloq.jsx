import React, { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import useLanguageStore from "../../store/languageStore";
import { IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const mockData = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  logo: "https://img.icons8.com/ios-filled/100/2E92A0/truck.png", // truck icon from icons8
  company: "Bridge Logistics",
  description:
    "Kabin nəqliyyatı və gömrük daxil olmaqla quru yükləşmə xidmətləri göstərir.",
  phone: "+994(50) 289-34-45",
  website: "bridgexapp.com",
}));

// Dropdown options for "Haradan gəlir"
const sourceOptions = [
  'Bakı',
  'Gəncə',
  'Sumqayıt',
  'Moskva',
  'İstanbul',
  'Tbilisi',
  'Tehran',
  'Digər'
];

export const Kataloq = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSource, setSelectedSource] = useState('Haradan gəlir');

  // Close dropdowns when filter modal closes
  useEffect(() => {
    if (!showFilter) {
      setActiveDropdown(null);
    }
  }, [showFilter]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown) {
        const dropdowns = document.querySelectorAll('.dropdown-container');
        let clickedInside = false;
        
        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    setSearchBar(
      <div className="relative w-full  md:w-[300px] px-[16px] md:px-0 md:pl-[16px] flex gap-2">
        <div className="flex items-center gap-2 relative w-full">
          <input
            type="text"
            placeholder={
              language === "az"
                ? "Axtar"
                : language === "en"
                ? "Search"
                : "Поиск"
            }
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="#A0A0A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <button
          className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] "
          onClick={() => setShowFilter(true)}
        >
          <IoFilter className="text-[20px]" />
          Filter
        </button>
      </div>
    );

    return () => setSearchBar(null);
  }, [setSearchBar, searchQuery, language]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        {/* Cards Grid */} 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative overflow-x-hidden">
          {/* Filter Modal */}
          <AnimatePresence>
            {showFilter && (
              <motion.div 
                className='absolute right-0 w-full md:w-[404px] bg-white shadow-xl z-[1000] flex flex-col p-[16px] md:p-[32px] rounded-[8px]'
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.3
                }}
              >
              {/* Right-side drawer */}
              <div className="flex flex-col">
                <button
                  className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0] hover:cursor-pointer"
                  onClick={() => setShowFilter(false)}
                >
                  <IoClose size={24} />
                </button>
                <form className="flex flex-col gap-4 mt-4">
                  {/* Boş tırın sayı input */}
                  <input 
                    type="text" 
                    placeholder="Boş tırın sayı" 
                    className="h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  
                  />
                  
                  {/* Haradan gəlir dropdown */}
                  <div className="w-full relative dropdown-container">
                    <button
                      type="button"
                      className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#2E92A0] text-[15px] font-medium flex items-center justify-between focus:outline-none hover:bg-[#F0F0F0]"
                      onClick={() => setActiveDropdown(activeDropdown === 'source' ? null : 'source')}
                    >
                      <span>{selectedSource}</span>
                      <svg 
                        width="24" 
                        height="24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${activeDropdown === 'source' ? 'rotate-180' : ''}`}
                      >
                        <path d="M7 10l5 5 5-5" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {/* Source Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === 'source' && (
                        <motion.div 
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E7E7] rounded-[8px] shadow-lg z-50 max-h-[200px] overflow-y-auto"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                        {sourceOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-3 text-left text-[#3F3F3F] text-[15px] hover:bg-[#F5F5F5] focus:outline-none focus:bg-[#F5F5F5]"
                            onClick={() => {
                              setSelectedSource(option);
                              setActiveDropdown(null);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button 
                    type="button" 
                    className="w-full mt-2 py-3 rounded-[8px] bg-[#2E92A0] text-white border font-medium text-[18px] hover:bg-[#fff] hover:cursor-pointer hover:text-[#2E92A0] hover:border-[#2E92A0] transition-colors duration-150"
                  >
                    Göster
                  </button>
                </form>
              </div>
              {/* Transparent click-outside area */}
              <div className="fixed z-40" onClick={() => setShowFilter(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {mockData.map((item) => (
            <Link
              key={item.id}
              to={`/dasinma/kataloq/${item.id}`}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition"
            >
              <div className="flex items-center justify-center h-[120px] bg-white border-b border-[#E7E7E7]">
                <img
                  src={item.logo}
                  alt={item.company}
                  className="max-h-[80px] max-w-[160px] object-contain"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">
                  {item.company}
                </h3>
                <p className="text-[#3F3F3F] text-[15px] mb-2">
                  {item.description}
                </p>
                <p className="text-[#A0A0A0] text-[13px] mt-auto mb-1">
                  {item.phone}
                </p>
                <a
                  href={`https://${item.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E92A0] text-[13px] underline"
                >
                  {item.website}
                </a>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">
            Geri
          </button>
          <button className="w-8 h-8 rounded bg-[#2E92A0] text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            2
          </button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            3
          </button>
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            İrəli
          </button>
        </div>
      </div>
    </div>
  );
};
