import { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward as IoIosArrowRight } from "react-icons/io";
import { useSearchBar } from "../../context/SearchBarContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion as Motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import useLanguageStore from "../../store/languageStore";

const HsCodesPage = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState({});
  const [hsCodesData, setHsCodesData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 100,
    total: 0
  });
  const contentRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const texts = {
    search: {
      en: "Search",
      ru: "Поиск",
      az: "Axtar"
    },
    pagination: {
      previous: {
        en: "Previous",
        ru: "Предыдущий",
        az: "Əvvəl"
      },
      next: {
        en: "Next",
        ru: "Следующий",
        az: "Sonra"
      }
    }
  };

  useEffect(() => {
    setSearchBar(
      <div className="relative w-full md:w-[300px] px-[16px]">
        <input
          type="text"
          placeholder={texts.search[language] || texts.search.az}
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
      fetchRootCategories();
    }
  }, [searchQuery]);

  const fetchRootCategories = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(`https://atfplatform.tw1.ru/api/code-categories?page=${page}`, {
        parent_id: null
      });
      const list = Array.isArray(response?.data?.data) ? response.data.data : response.data;
      setHsCodesData(list || []);
      if (response?.data?.meta) {
        const meta = response.data.meta;
        setPagination({
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          perPage: meta.per_page,
          total: meta.total,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHsCodesData([]);
      } else {
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

  const fetchChildren = async (parentId) => {
    try {
      setLoadingChildren(prev => ({ ...prev, [parentId]: true }));
      const response = await axios.post('https://atfplatform.tw1.ru/api/code-categories', {
        parent_id: parentId
      });
      const children = Array.isArray(response?.data?.data) ? response.data.data : response.data;
      
      console.log('Children data for parent ID', parentId, ':', children);
      
      // Update the parent's children in the data
      setHsCodesData(prevData => {
        const updateChildren = (items) => {
          return items.map(item => {
            if (item.id === parentId) {
              return { ...item, children: children || [] };
            }
            if (item.children) {
              return { ...item, children: updateChildren(item.children) };
            }
            return item;
          });
        };
        return updateChildren(prevData);
      });

      // Force update expanded state to show children
      setExpandedGroups(prev => ({
        ...prev,
        [parentId]: true
      }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No children found for parent ID:', parentId);
        // No children found, that's okay - set empty children array
        setHsCodesData(prevData => {
          const updateChildren = (items) => {
            return items.map(item => {
              if (item.id === parentId) {
                return { ...item, children: [] };
              }
              if (item.children) {
                return { ...item, children: updateChildren(item.children) };
              }
              return item;
            });
          };
          return updateChildren(prevData);
        });
      } else {
        console.error('Error fetching children:', error);
        const errorMessages = {
          en: "Error loading children",
          ru: "Ошибка при загрузке подкатегорий",
          az: "Alt kateqoriyaları yükləyərkən xəta baş verdi"
        };
        toast.error(errorMessages[language] || errorMessages.az);
      }
    } finally {
      setLoadingChildren(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const searchHsCodes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.post('https://atfplatform.tw1.ru/api/code-categories-search', {
        q: query,
        include_children: true
      });
      const list = Array.isArray(response?.data?.data) ? response.data.data : response.data;
      const newExpandedGroups = {};
      const expandMatchedItems = (items, shouldExpand = false) => {
        items.forEach(item => {
          if (shouldExpand || item.code?.toString().includes(query)) {
            newExpandedGroups[item.id] = true;
          }
          if (item.children && item.children.length > 0) {
            expandMatchedItems(item.children, shouldExpand || item.code?.toString().includes(query));
          }
        });
      };
      
      expandMatchedItems(list || []);
      setExpandedGroups(newExpandedGroups);
      setHsCodesData(list || []);
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 422)) {
        setHsCodesData([]);
      } else {
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

  const toggleGroup = async (groupId) => {
    const isCurrentlyExpanded = isExpanded(groupId);
    // If we're expanding and don't have children loaded yet, fetch them
    if (!isCurrentlyExpanded) {
      setExpandedGroups(prev => ({
        ...prev,
        [groupId]: true
      }));
      const item = findItemById(hsCodesData, groupId);
      if (item && (!item.children || item.children.length === 0)) {
        await fetchChildren(groupId);
      }
    } else {
      setExpandedGroups(prev => ({
        ...prev,
        [groupId]: false
      }));
    }
  };

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const isExpanded = (groupId) => {
    return !!expandedGroups[groupId];
  };

  const flattenData = (data, level = 0, parentExpanded = true, isSearchResult = false) => {
    let result = [];
    
    data.forEach(item => {
      const isMatch = searchQuery && item.code?.toString().includes(searchQuery);
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

  const getFilteredAndFlattenedData = () => {
    return flattenData(hsCodesData, 0, true, !!searchQuery);
  };

  const filteredHsCodes = getFilteredAndFlattenedData();

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchRootCategories(page);
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
                    } cursor-pointer`}
                    onClick={() => toggleGroup(item.id)}
                    variants={rowVariants}
                  >
                    <div className="flex items-center w-full gap-x-[]">
                      <div style={{ width: `${item.level * 24}px` }} className="flex-shrink-0"></div>
                      <div className="mr-2 text-[#3F3F3F] flex-shrink-0">
                        {loadingChildren[item.id] ? (
                          <div className="w-4 h-4 border-t-2 border-b-2 border-[#2E92A0] rounded-full animate-spin" />
                        ) : isExpanded(item.id) ? (
                          <IoIosArrowDown className="text-[#2E92A0]" />
                        ) : (
                          <IoIosArrowRight className="text-[#2E92A0]" />
                        )}
                      </div>
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

          {/* Pagination Controls */}
          {!searchQuery && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-[#E7E7E7]">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#2E92A0] hover:bg-[#F5F5F5]'
                }`}
              >
                {texts.pagination.previous[language] || texts.pagination.previous.az}
              </button>
              
              <span className="text-[#3F3F3F]">
                {pagination.currentPage} / {pagination.lastPage}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === pagination.lastPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#2E92A0] hover:bg-[#F5F5F5]'
                }`}
              >
                {texts.pagination.next[language] || texts.pagination.next.az}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HsCodesPage;
