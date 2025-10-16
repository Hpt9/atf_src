import React, { useState, useEffect } from 'react';
import { IoFilter } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { useSearchBar } from "../../context/SearchBarContext";
import useLanguageStore from '../../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';

// API base URL; replace if you have an env var
const API_BASE = 'https://atfplatform.tw1.ru';

const tabs = [
  { label: 'Hamısı', value: 'all' },
  { label: 'Gələn', value: 'incoming' },
  { label: 'Gedən', value: 'outgoing' },
];

// Dropdown options
const unitOptions = [
  'Ton',
  'Palet',
  'Ədəd',
  'Kubmetr (m³)',
  'Konteyner tipi (20ft)',
  'Konteyner tipi (40ft)'
];

const truckTypeOptions = [
  'Tentli',
  'Frigo (Soyuduculu)',
  'Izotermik',
  'Platforma',
  'Lowbed'
];

export const Elanlar = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // 'unit' or 'truckType' or null
  const [selectedUnit, setSelectedUnit] = useState('Vahid');
  const [selectedTruckType, setSelectedTruckType] = useState('Tırın tipi');
  
  // Fetch individuals adverts
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE}/api/adverts/individuals?page=${page}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setItems(Array.isArray(json?.data) ? json.data : []);
        setMeta(json?.meta || null);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError('Verilər yüklənərkən xəta baş verdi');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [page]);

  // Close dropdowns when filter modal closes
  useEffect(() => {
    if (!showFilter) {
      setActiveDropdown(null);
    }
  }, [showFilter]);

  // Handle click outside dropdowns and filter modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown clicks
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

      // Handle filter modal clicks
      if (showFilter) {
        const filterModal = document.querySelector('.filter-modal');
        if (filterModal && !filterModal.contains(event.target)) {
          setShowFilter(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, showFilter]);


    useEffect(() => {
      setSearchBar(
        <div className="relative w-full md:w-[300px] pl-[16px] hidden md:block">
          <input
            type="text"
            placeholder={language === 'az' ? 'Axtar' : language === 'en' ? 'Search' : 'Поиск'}
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button className="absolute right-7 top-1/2 transform -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      );
      
      return () => setSearchBar(null);
    }, [setSearchBar, searchQuery, language]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        {/* Search and Filter Row (responsive) */}
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4 mb-6">
          {/* Tabs (bottom on mobile, left on desktop) */}
          <div className="flex  md:order-1 order-2 w-full md:w-auto justify-center md:justify-start">
            {tabs.map((tab, index) => (
              <button
                key={tab.value}
                className={`px-6 py-2 font-medium text-[16px] w-1/3 md:w-fit border transition-colors duration-150 ${
                  activeTab === tab.value
                    ? 'bg-[#2E92A0] text-white border-[#2E92A0]'
                    : 'bg-white text-[#2E92A0] border-[#2E92A0] hover:bg-[#2E92A0] hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.value)}
                style={{
                    borderRadius: index === 0 ? '8px 0 0 8px' : index === tabs.length - 1 ? '0 8px 8px 0' : '0',
                }}
              >
                {tab.label}
              </button>
            
            ))}
            {/* Filter button */}
          </div>
            <button
              className="flex-shrink-0 hidden md:flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] "
              onClick={() => setShowFilter(true)}
            >
              <IoFilter className="text-[20px]" />
              Filter
            </button>
          {/* Search and Filter (top on mobile, right on desktop) */}
          <div className="flex w-full md:w-auto gap-2 md:order-2 order-1 md:hidden">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder={language === 'az' ? 'Axtar' : language === 'en' ? 'Search' : 'Поиск'}
                className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <button
              className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px]"
              onClick={() => setShowFilter(true)}
            >
              <IoFilter className="text-[20px]" />
              Filter
            </button>
          </div>
        </div>
        {/* Filter Modal */}
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative overflow-x-hidden">
        <AnimatePresence>
          {showFilter && (
                         <motion.div 
               className='absolute right-0 w-full md:w-[404px] bg-white shadow-xl z-[1000] flex flex-col p-[16px] md:p-[32px] rounded-[8px] filter-modal'
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
                className=" w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0] hover:cursor-pointer"
                onClick={() => setShowFilter(false)}
              >
                <IoClose size={24} />
              </button>
              <form className="flex flex-col gap-4 mt-4">
                                 <div className="flex w-full">
                   <input type="datetime-local" placeholder="Çıxma vaxtı" className="h-[48px] px-4 py-2 w-1/2 rounded-l-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  />
                   <input type="datetime-local" placeholder="Gəlmə vaxtı" className="h-[48px] px-4 py-2 w-1/2 rounded-r-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  />
                 </div>
                 <div className="flex w-full">
                   <input type="text" placeholder="Haradan" className="h-[48px] px-4 py-2 w-1/2 rounded-l-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  />
                   <input type="text" placeholder="Hara" className="h-[48px] px-4 py-2 w-1/2 rounded-r-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  />
                 </div>
                 <input type="text" placeholder="Yükün miqdarı" className="h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none focus:border-[#2E92A0] focus:bg-white"  />
                
                                 {/* Tırın tutumu custom select */}
                 <div className="w-full relative dropdown-container">
                   <div className="w-full flex items-center border border-[#E7E7E7] rounded-[8px] overflow-hidden h-[48px] bg-[#FAFAFA]">
                     <div className="w-[228px] flex items-center justify-start h-full text-[#A0A0A0] text-[16px] font-semibold pl-[16px]">Tırın tutumu</div>
                     <button 
                       type="button" 
                       className="w-[calc(100%-228px)] min-w-[110px] flex items-center justify-end h-full text-[#2E92A0] text-[16px] font-semibold pr-[16px] gap-2 focus:outline-none border-l border-[#E7E7E7] hover:bg-[#F0F0F0]"
                       onClick={() => setActiveDropdown(activeDropdown === 'unit' ? null : 'unit')}
                     >
                       {selectedUnit}
                       <svg 
                         width="24" 
                         height="24" 
                         fill="none" 
                         xmlns="http://www.w3.org/2000/svg"
                         className={`transition-transform duration-200 ${activeDropdown === 'unit' ? 'rotate-180' : ''}`}
                       >
                         <path d="M7 10l5 5 5-5" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </button>
                   </div>
                   
                   {/* Unit Dropdown Menu */}
                   <AnimatePresence>
                     {activeDropdown === 'unit' && (
                       <motion.div 
                         className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E7E7] rounded-[8px] shadow-lg z-50 max-h-[200px] overflow-y-auto"
                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                       >
                       {unitOptions.map((option, index) => (
                         <button
                           key={index}
                           type="button"
                           className="w-full px-4 py-3 text-left text-[#3F3F3F] text-[15px] hover:bg-[#F5F5F5] focus:outline-none focus:bg-[#F5F5F5]"
                           onClick={() => {
                             setSelectedUnit(option);
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

                {/* Tırın tipi dropdown */}
                 <div className="w-full relative dropdown-container">
                   <button
                     type="button"
                     className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#2E92A0] text-[15px] font-medium flex items-center justify-between focus:outline-none hover:bg-[#F0F0F0]"
                     onClick={() => setActiveDropdown(activeDropdown === 'truckType' ? null : 'truckType')}
                   >
                     <span>{selectedTruckType}</span>
                     <svg 
                       width="24" 
                       height="24" 
                       fill="none" 
                       xmlns="http://www.w3.org/2000/svg"
                       className={`transition-transform duration-200 ${activeDropdown === 'truckType' ? 'rotate-180' : ''}`}
                     >
                       <path d="M7 10l5 5 5-5" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                   
                   {/* Truck Type Dropdown Menu */}
                   <AnimatePresence>
                     {activeDropdown === 'truckType' && (
                       <motion.div 
                         className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E7E7] rounded-[8px] shadow-lg z-50 max-h-[200px] overflow-y-auto"
                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                       >
                       {truckTypeOptions.map((option, index) => (
                         <button
                           key={index}
                           type="button"
                           className="w-full px-4 py-3 text-left text-[#3F3F3F] text-[15px] hover:bg-[#F5F5F5] focus:outline-none focus:bg-[#F5F5F5]"
                           onClick={() => {
                             setSelectedTruckType(option);
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
                <button type="button" className="w-full mt-2 py-3 rounded-[8px] bg-[#2E92A0] text-white border font-medium text-[18px] hover:bg-[#fff] hover:cursor-pointer hover:text-[#2E92A0] hover:border-[#2E92A0] transition-colors duration-150">Göster</button>
              </form>
            </div>
                         </motion.div>
          )}
        </AnimatePresence>
          {loading && (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col animate-pulse">
                <div className="w-full h-[180px] bg-gray-200" />
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))
          )}
          {!loading && items.map((item) => {
            const image = item?.photos?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';
            const title = item?.name?.az || `${item?.from?.az || ''} – ${item?.to?.az || ''}` || '—';
            const subtitle = item?.load_type?.az || item?.description?.az || '';
            const date = item?.reach_from_address || '';
            return (
              <Link
                key={item.slug}
                to={`/dasinma/fiziki-sexs-elanlari/${item.slug}`}
                className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">{title}</h3>
                  <p className="text-[#3F3F3F] text-[15px] mb-2">{subtitle}</p>
                  <p className="text-[#A0A0A0] text-[13px] mt-auto">{date}</p>
                </div>
              </Link>
            );
          })}
          {!loading && !items.length && !error && (
            <div className="col-span-full text-center text-[#A0A0A0]">Nəticə tapılmadı</div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">{error}</div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={!meta || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Geriye
          </button>
          {meta?.links?.filter(l => l.label && !l.label.includes('Əvvəl') && !l.label.includes('Sonra')).map((l, idx) => {
            const label = l.label;
            // Attempt to parse page from link url
            const url = l.url || '';
            const match = url.match(/page=(\d+)/);
            const pageNum = match ? Number(match[1]) : Number(label);
            const isActive = l.active;
            return (
              <button
                key={idx}
                className={`w-8 h-8 rounded font-medium ${isActive ? 'bg-[#2E92A0] text-white' : 'bg-white border border-[#E7E7E7] text-[#3F3F3F]'}`}
                onClick={() => !isActive && pageNum && setPage(pageNum)}
              >
                {label}
              </button>
            );
          })}
          <button
            className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={!meta || page >= (meta?.last_page || 1)}
            onClick={() => setPage((p) => (meta ? Math.min(meta.last_page || p + 1, p + 1) : p + 1))}
          >
            İreli
          </button>
        </div>
      </div>
    </div>
  );
};
