import { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward as IoIosArrowRight } from "react-icons/io";
import { useSearchBar } from "../../context/SearchBarContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion as Motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";

const HsCodesPage = () => {
  const { setSearchBar } = useSearchBar();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [hsCodesData, setHsCodesData] = useState([]);
  const contentRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const { language } = useSearchBar();

  useEffect(() => {
    setSearchBar(
      <div className="relative w-full md:w-[300px] px-[16px]">
        <input
          type="text"
          placeholder={
            language === 'en' ? 'Search HS codes...' :
            language === 'ru' ? 'Поиск HS кодов...' :
            'HS kodları üzrə axtarış...'
          }
          className="w-full px-4 py-2 pl-10 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IoSearch className="absolute left-[24px] top-1/2 transform -translate-y-1/2 text-[20px] text-[#3F3F3F]" />
      </div>
    );

    return () => {
      setSearchBar(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [setSearchBar, searchQuery, language]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchHsCodes(searchQuery.trim());
      }, 500);
    } else {
      fetchHsCodes();
    }
  }, [searchQuery]);

  const fetchHsCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://atfplatform.tw1.ru/api/code-categories');
      setHsCodesData(response.data);
    } catch (error) {
      // Check if error is 404 (Not Found) or other data-related error
      if (error.response && error.response.status === 404) {
        // For 404 errors, just set empty data without showing error toast
        setHsCodesData([]);
      } else {
        // For other errors, show the toast error message
        const errorMessages = {
          en: "Error loading data",
          ru: "Ошибка при загрузке данных",
          az: "Məlumatları yükləyərkən xəta baş verdi"
        };
        toast.error(errorMessages[language] || errorMessages.az);
        setHsCodesData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchHsCodes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.post('https://atfplatform.tw1.ru/api/code-categories-search', {
        q: query,
        include_children: true
      });
      
      // After getting search results, automatically expand the matched items
      const newExpandedGroups = {};
      const expandMatchedItems = (items, shouldExpand = false) => {
        items.forEach(item => {
          if (shouldExpand || item.code.toString().includes(query)) {
            newExpandedGroups[item.id] = true;
          }
          if (item.children && item.children.length > 0) {
            // If current item matches search, expand all its children
            expandMatchedItems(item.children, shouldExpand || item.code.toString().includes(query));
          }
        });
      };
      
      expandMatchedItems(response.data);
      setExpandedGroups(newExpandedGroups);
      setHsCodesData(response.data);
    } catch (error) {
      // Check if error is 404 (Not Found) or 422 (Unprocessable Content)
      if (error.response && (error.response.status === 404 || error.response.status === 422)) {
        // For 404 and 422 errors, just set empty data without showing error toast
        setHsCodesData([]);
      } else {
        // For other errors, show the toast error message
        const errorMessages = {
          en: "Error during search",
          ru: "Ошибка при поиске",
          az: "Axtarış zamanı xəta baş verdi"
        };
        toast.error(errorMessages[language] || errorMessages.az);
        setHsCodesData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle expansion of a group
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if a group is expanded
  const isExpanded = (groupId) => {
    return !!expandedGroups[groupId];
  };

  // Flatten the hierarchical data for filtering
  const flattenData = (data, level = 0, parentExpanded = true, isSearchResult = false) => {
    let result = [];
    
    data.forEach(item => {
      const isMatch = searchQuery && item.code.toString().includes(searchQuery);
      const shouldShow = parentExpanded || isMatch || isSearchResult;
      
      if (shouldShow) {
        const flatItem = {
          ...item,
          name: item.name.az,
          level,
          visible: true,
          hasChildren: item.children && item.children.length > 0
        };
        
        result.push(flatItem);
        
        if (item.children && item.children.length > 0) {
          // Only show children if parent is expanded (even in search results)
          const showChildren = isExpanded(item.id);
          const childrenResults = flattenData(
            item.children,
            level + 1,
            showChildren,
            isSearchResult || isMatch
          );
          if (showChildren) {
            result = [...result, ...childrenResults];
          }
        }
      }
    });
    
    return result;
  };

  // Get filtered and flattened data
  const getFilteredAndFlattenedData = () => {
    return flattenData(hsCodesData, 0, true, !!searchQuery);
  };

  const filteredHsCodes = getFilteredAndFlattenedData();

  // Animation variants for table rows
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <div className="bg-white border border-[#E7E7E7] rounded-[8px] overflow-hidden">
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7]">
            <div className="flex items-center mobile:gap-x-[16px] lg:gap-x-[24px]">
              <p className="font-medium text-[#3F3F3F] text-[14px] min-w-[100px]">
                {language === 'en' ? 'Code' : 
                 language === 'ru' ? 'Код' : 
                 'Kod'}
              </p>
              <p className="font-medium text-[#3F3F3F] text-[14px]">
                {language === 'en' ? 'HS Name' : 
                 language === 'ru' ? 'Наименование HS' : 
                 'HS adı'}
              </p>
            </div>
            {/* <p className="font-medium text-[#3F3F3F] text-[14px]">
              {language === 'en' ? 'Actions' : 
               language === 'ru' ? 'Действия' : 
               'Əməliyyatlar'}
            </p> */}
          </div>
          
          <div ref={contentRef} className="max-h-[640px] overflow-y-auto">
            <Motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredHsCodes.length > 0 ? (
                filteredHsCodes.map((item) => (
                  <Motion.div 
                    key={item.id} 
                    className={`p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5] ${
                      item.level === 0 ? 'bg-[#F9F9F9]' : 
                      item.level === 1 ? 'bg-[#FCFCFC]' : 
                      'bg-white'
                    } ${item.hasChildren ? 'cursor-pointer' : ''}`}
                    onClick={item.hasChildren ? () => toggleGroup(item.id) : undefined}
                    variants={rowVariants}
                  >
                    <div className="flex items-center w-full gap-x-[]">
                      <div style={{ width: `${item.level * 24}px` }} className="flex-shrink-0"></div>
                      
                      {item.hasChildren ? (
                        <div className="mr-2 text-[#3F3F3F] flex-shrink-0">
                          {isExpanded(item.id) ? 
                            <IoIosArrowDown className="text-[#2E92A0]" /> : 
                            <IoIosArrowRight className="text-[#2E92A0]" />
                          }
                        </div>
                      ) : (
                        <div className="mr-2 w-4 flex-shrink-0"></div>
                      )}
                      
                      <div className="flex items-center w-full mobile:gap-x-[16px] lg:gap-x-[0px]">
                        <p className={`text-[#3F3F3F] text-[14px] min-w-[100px] ${
                          item.level === 0 ? 'font-bold' : 
                          item.level === 1 ? 'font-medium' : 
                          'font-normal'
                        }`}>
                          {item.code}
                        </p>
                        <p className={`text-[#3F3F3F] text-[14px] flex-1 ${
                          item.level === 0 ? 'font-bold uppercase' : 
                          item.level === 1 ? 'font-medium' : 
                          'font-normal'
                        }`}>
                          {item.name}
                        </p>
                      </div>
                    </div>
                    
                    {/* <div className="flex items-center gap-x-[8px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E7E7E7]"
                        title={item.info?.az}
                      >
                        <LuInfo className="w-[20px] h-[20px] text-[#2E92A0]" />
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E7E7E7]">
                        <FaRegFilePdf className="w-[20px] h-[20px] text-[#2E92A0]" />
                      </button>
                    </div> */}
                  </Motion.div>
                ))
              ) : (
                <Motion.div 
                  className="p-[16px] text-center text-[#3F3F3F]"
                  variants={rowVariants}
                >
                  {language === 'en' ? 'No matching results found' :
                   language === 'ru' ? 'Результаты не найдены' :
                   'Axtarışa uyğun nəticə tapılmadı'}
                </Motion.div>
              )}
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HsCodesPage;
