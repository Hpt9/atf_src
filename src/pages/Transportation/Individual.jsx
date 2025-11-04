import React, { useState, useEffect } from 'react';
import { IoFilter } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { useSearchBar } from "../../context/SearchBarContext";
import useLanguageStore from '../../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";

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
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // 'unit' or 'truckType' or null
  const [selectedUnit, setSelectedUnit] = useState('Vahid');
  const [selectedTruckType, setSelectedTruckType] = useState('Tırın tipi');
  // Dynamic lists
  const [areas, setAreas] = useState([]);
  const [units, setUnits] = useState([]);
  const [truckTypes, setTruckTypes] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [noResultsMsg, setNoResultsMsg] = useState("");
  // Filter values
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [truckTypeId, setTruckTypeId] = useState("");
  const [capacity, setCapacity] = useState("");

  // Fetch filter lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setListsLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : {};
        const [areasRes, unitsRes, trucksRes] = await Promise.all([
          fetch('https://atfplatform.tw1.ru/api/areas', { headers }),
          fetch('https://atfplatform.tw1.ru/api/units', { headers }),
          fetch('https://atfplatform.tw1.ru/api/truck-types', { headers })
        ]);
        const [areasJson, unitsJson, trucksJson] = await Promise.all([
          areasRes.ok ? areasRes.json() : Promise.resolve({ data: [] }),
          unitsRes.ok ? unitsRes.json() : Promise.resolve({ data: [] }),
          trucksRes.ok ? trucksRes.json() : Promise.resolve({ data: [] })
        ]);
        setAreas(Array.isArray(areasJson?.data) ? areasJson.data : []);
        setUnits(Array.isArray(unitsJson?.data) ? unitsJson.data : []);
        setTruckTypes(Array.isArray(trucksJson?.data) ? trucksJson.data : []);
        // Debug logs
        console.log('Areas(list):', areasJson?.data);
        console.log('Units(list):', unitsJson?.data);
        console.log('TruckTypes(list):', trucksJson?.data);
      } catch (e) {
        console.error('Error fetching filter lists', e);
      } finally {
        setListsLoading(false);
      }
    };
    fetchLists();
  }, [token]);
  const getPageTitle = () => {
    switch(language) {
      case 'en':
        return 'Individual Advertisements';
      case 'ru':
        return 'Индивидуальные объявления';
      default:
        return 'Fiziki şəxs elanları';
    }
  };
  // Fetch individuals adverts
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async (body = {}) => {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE}/api/adverts/individuals`;
        const res = await fetch(url, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body || {}),
          signal: controller.signal 
        });
        if (!res.ok) {
          if (res.status === 404) {
            setItems([]);
            setMeta(null);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        setItems(list);
        setMeta(json?.meta || null);
        setNoResultsMsg("");
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError('Verilər yüklənərkən xəta baş verdi');
        }
      } finally {
        setLoading(false);
      }
    };
    // initial load without filters
    fetchData({});
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


    // useEffect(() => {
    //   setSearchBar(
    //     <div className="relative w-full md:w-[300px] pl-[16px] hidden md:block">
    //       <input
    //         type="text"
    //         placeholder={language === 'az' ? 'Axtar' : language === 'en' ? 'Axtar' : 'Поиск'}
    //         className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
    //         value={searchQuery}
    //         onChange={(e) => {
    //           setSearchQuery(e.target.value);
    //         }}
    //       />
    //       <button className="absolute right-7 top-1/2 transform -translate-y-1/2">
    //         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //           <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //         </svg>
    //       </button>
    //     </div>
    //   );
      
    //   return () => setSearchBar(null);
    // }, [setSearchBar, searchQuery, language]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 h-[calc(100vh-303px)] min-h-[calc(100vh-203px)]">
        {/* Search and Filter Row (responsive) */}
        <h1 className="block md:hidden text-[20px] md:text-[32px] font-semibold text-[#2E92A0] mb-8">
          {getPageTitle()}
        </h1>
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4 mb-6">
          {/* Tabs (bottom on mobile, left on desktop) */}
          
            <button
              className="flex-shrink-0 hidden md:flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] "
              onClick={() => setShowFilter(true)}
            >
              <IoFilter className="text-[20px]" />
              Filtr
            </button>
          {/* Search and Filter (top on mobile, right on desktop) */}
          <div className="flex w-full md:w-auto gap-2 md:order-2 order-1 md:hidden">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder={language === 'az' ? 'Axtar' : language === 'en' ? 'Axtar' : 'Поиск'}
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
              Filtr
            </button>
          </div>
        </div>
        {/* Filtr Modal */}
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative overflow-x-hidden h-full">
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
                                 
                <div className="flex flex-col w-full gap-4">
                  <select value={fromId} onChange={(e)=>setFromId(e.target.value)} disabled={listsLoading} className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]">
                    <option value="">Haradan</option>
                    {areas.map((a, idx) => (
                      <option key={a.id || idx} value={a.id}>
                        {(a.country?.[language] || a.country?.az || '') + (a.city?.[language] ? `, ${a.city?.[language]}` : a.city?.az ? `, ${a.city.az}` : '') + (a.region?.[language] ? `, ${a.region?.[language]}` : a.region?.az ? `, ${a.region.az}` : '')}
                      </option>
                    ))}
                  </select>
                  <select value={toId} onChange={(e)=>setToId(e.target.value)} disabled={listsLoading} className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]">
                    <option value="">Hara</option>
                    {areas.map((a, idx) => (
                      <option key={a.id || idx} value={a.id}>
                        {(a.country?.[language] || a.country?.az || '') + (a.city?.[language] ? `, ${a.city?.[language]}` : a.city?.az ? `, ${a.city.az}` : '') + (a.region?.[language] ? `, ${a.region?.[language]}` : a.region?.az ? `, ${a.region.az}` : '')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tırın tutumu combined input */}
                <div className="w-full">
                  <div className="flex items-center border border-[#E7E7E7] rounded-lg overflow-hidden h-[48px] bg-white">
                    <input 
                      type="number" 
                      placeholder="Tutum" 
                      value={capacity}
                      min={0}
                      onKeyDown={(e)=>{ if (["-","+","e","E"].includes(e.key)) e.preventDefault(); }}
                      onChange={(e)=>{
                        const v = e.target.value;
                        if (v === "") { setCapacity(""); return; }
                        const n = Math.max(0, Number(v));
                        setCapacity(Number.isNaN(n) ? "" : String(n));
                      }}
                      className="flex-1 h-full px-4 py-2 text-[#3F3F3F] text-[15px] focus:outline-none border-none"
                    />
                    <div className="w-px h-6 bg-[#E7E7E7]"></div>
                    <select 
                      disabled={listsLoading} 
                      value={unitId}
                      onChange={(e)=>setUnitId(e.target.value)}
                      className="flex-1 h-full px-4 py-2 text-[#3F3F3F] text-[15px] focus:outline-none border-none bg-transparent"
                    >
                      <option value="">Vahid</option>
                      {units.map((u, idx) => (
                        <option key={u.id || idx} value={u.id}>
                          {u.type?.[language] || u.type?.az || u.type || '-'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Truck type select */}
                <div className="w-full">
                  <select value={truckTypeId} onChange={(e)=>setTruckTypeId(e.target.value)} disabled={listsLoading} className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]">
                    <option value="">Tırın tipi</option>
                    {truckTypes.map((t, idx) => (
                      <option key={t.id || idx} value={t.id}>
                        {t.type?.[language] || t.type?.az || t.type || '-'}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  type="button" 
                  className="w-full mt-2 py-3 rounded-[8px] bg-[#2E92A0] text-white border font-medium text-[18px] hover:bg-[#fff] hover:cursor-pointer hover:text-[#2E92A0] hover:border-[#2E92A0] transition-colors duration-150"
                  onClick={async ()=>{
                    const body = {};
                    if (fromId) body.from_id = Number(fromId);
                    if (toId) body.to_id = Number(toId);
                    if (unitId) body.unit_id = Number(unitId);
                    if (truckTypeId) body.truck_type_id = Number(truckTypeId);
                    if (capacity) body.capacity = Number(capacity);
                    try {
                      setLoading(true);
                      setError(null);
                      const res = await fetch(`${API_BASE}/api/adverts/individuals`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                      });
                      if (!res.ok) {
                        if (res.status === 404) {
                          setItems([]);
                          setMeta(null);
                          setNoResultsMsg('Filterə uyğun nəticə tapılmadı');
                          setShowFilter(false);
                          return;
                        }
                        throw new Error(`HTTP ${res.status}`);
                      }
                      const json = await res.json();
                      const list = Array.isArray(json?.data) ? json.data : [];
                      setItems(list);
                      setMeta(json?.meta || null);
                      setNoResultsMsg(list.length ? '' : 'Filterə uyğun nəticə tapılmadı');
                      setShowFilter(false);
                    } catch (e) {
                      setError('Verilər yüklənərkən xəta baş verdi');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Göstər
                </button>
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
                className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition h-fit"
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
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-[#FAFAFA] border border-[#E7E7E7] rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 text-[#A0A0A0] mb-3"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <div className="text-[#3F3F3F] text-[16px] font-medium mb-1">{noResultsMsg || 'Nəticə tapılmadı'}</div>
              <div className="text-[#6B7280] text-[14px]">Sorğunuzu dəyişdirin və ya daha sonra yenidən yoxlayın.</div>
            </div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">{error}</div>
          )}
        </div>
        {/* Pagination - only show when there are results and more than 1 page */}
        {!loading && items.length > 0 && (meta?.last_page || 1) > 1 && (
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
        )}
      </div>
    </div>
  );
};
