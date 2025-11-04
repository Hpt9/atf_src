import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuInfo } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward as IoIosArrowRight } from "react-icons/io";
import { IoFolderOutline } from "react-icons/io5";
import { useSearchBar } from "../../context/SearchBarContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion as Motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import useLanguageStore from "../../store/languageStore";

const HsCodesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedHsCode, setSelectedHsCode] = useState(null);
  const [activeTab, setActiveTab] = useState('tariff');
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
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

  // Initialize search from navigation state (e.g., coming from Home page global search)
  useEffect(() => {
    const incoming = location?.state?.searchQuery;
    if (incoming !== undefined && incoming !== null && incoming !== "") {
      const q = String(incoming);
      setSearchQuery(q);
      // Trigger search immediately for initial navigation
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchHsCodes(q);
      // Clear state to prevent re-trigger on back/forward
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        // No children found - show table instead
        const parentItem = findItemById(hsCodesData, parentId);
        if (parentItem) {
          console.log('Parent item found:', parentItem);
          if (Array.isArray(parentItem.restrictions)) {
            console.log('Restrictions (from parent item) for code', parentItem.code, ':', parentItem.restrictions);
            console.log('Restrictions count (parent item):', parentItem.restrictions.length);
          } else {
            console.log('No restrictions on parent item for code', parentItem.code);
          }
          // Set the selected HS code with the correct structure
          setSelectedHsCode({
            id: parentItem.id,
            code: parentItem.code,
            name: parentItem.name,
            parameters: parentItem.parameters || []
          });
          setShowTable(true);
          // Set empty children array
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
        }
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

  const closeTable = () => {
    setShowTable(false);
    setSelectedHsCode(null);
    setTableData([]);
    setActiveTab('tariff');
  };

  // Debug effect to log when selectedHsCode changes
  useEffect(() => {
    if (selectedHsCode) {
      console.log('Selected HS Code updated:', selectedHsCode);
      console.log('Has parameters:', selectedHsCode.parameters);
      console.log('Parameters length:', selectedHsCode.parameters?.length);
    }
  }, [selectedHsCode]);

  // Helper function to recursively extract parameters from the nested HS code structure
  const extractParameters = (node) => {
    let params = [];
    if (!node) return params;

    // If the node itself has parameters
    if (node.parameters && Array.isArray(node.parameters)) {
      params = params.concat(node.parameters);
    }

    // If the node has children, recurse
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        params = params.concat(extractParameters(child));
      });
    }
    return params;
  };

  // Auto load parameters when opening modal or switching to parameters tab
  useEffect(() => {
    if (!showTable) return;
    if (activeTab !== 'parameters') return;
    // Prefer already-available parameters on selected item
    if (selectedHsCode?.parameters && selectedHsCode.parameters.length > 0) {
      setTableData(selectedHsCode.parameters);
      return;
    }
    // Otherwise try to fetch
    fetchParametersData();
  }, [showTable, activeTab]);

  // Fetch focused HS code details via search endpoint and log key sections
  const fetchCategoryDetailsForCode = async () => {
    if (!showTable || !selectedHsCode?.code) return;
    try {
      setDetailsLoading(true);
      const payload = { q: selectedHsCode.code };
      console.log('Fetching category details via search for code:', selectedHsCode.code, 'payload:', payload);
      const res = await axios.post('https://atfplatform.tw1.ru/api/code-categories-search', payload);
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      const match = (list || []).find((it) => it.code === selectedHsCode.code);
      if (!match) {
        console.log('No exact match returned from code-categories-search for code', selectedHsCode.code, 'raw:', list);
        setCategoryDetails(null);
        return;
      }
      console.log('Search match for code', selectedHsCode.code, ':', match);
      if (Array.isArray(match.parameters)) {
        console.log('Search.parameters for code', selectedHsCode.code, '(len=', match.parameters.length, '):', match.parameters);
        setTableData(match.parameters);
      } else {
        console.log('Search.parameters absent for code', selectedHsCode.code);
        setTableData([]);
      }
      setCategoryDetails(match);
      if (Array.isArray(match.declarations)) {
        console.log('Search.declarations for code', selectedHsCode.code, '(len=', match.declarations.length, '):', match.declarations);
      } else {
        console.log('Search.declarations absent for code', selectedHsCode.code);
      }
      if (Array.isArray(match.taxes)) {
        console.log('Search.taxes for code', selectedHsCode.code, '(len=', match.taxes.length, '):', match.taxes);
      } else {
        console.log('Search.taxes absent for code', selectedHsCode.code);
      }
      if (Array.isArray(match.restrictions)) {
        console.log('Search.restrictions for code', selectedHsCode.code, '(len=', match.restrictions.length, '):', match.restrictions);
      } else {
        console.log('Search.restrictions absent for code', selectedHsCode.code);
      }
    } catch (err) {
      console.error('Error fetching code-categories-search details for', selectedHsCode?.code, err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Run the search logging every time the table opens for a focused HS code
  useEffect(() => {
    if (!showTable) return;
    fetchCategoryDetailsForCode();
  }, [showTable, selectedHsCode?.code]);

  // Function to fetch parameters data from the API
  const fetchParametersData = async () => {
    if (!selectedHsCode?.id) return;
    
    try {
      console.log('Fetching parameters data for HS Code ID:', selectedHsCode.id);
      console.log('Selected HS Code:', selectedHsCode);
      
      // Try to find the specific HS code in the current data first
      const findHsCodeInData = (items, targetCode) => {
        for (const item of items) {
          if (item.code === targetCode) {
            return item;
          }
          if (item.children && item.children.length > 0) {
            const found = findHsCodeInData(item.children, targetCode);
            if (found) return found;
          }
        }
        return null;
      };
      
      // First try to find the HS code in the current data
      const foundHsCode = findHsCodeInData(hsCodesData, selectedHsCode.code);
      if (foundHsCode && foundHsCode.parameters) {
        console.log('Found HS code in current data with parameters:', foundHsCode.parameters);
        console.log('Parameters count (local):', foundHsCode.parameters.length);
        if (Array.isArray(foundHsCode.restrictions)) {
          console.log('Restrictions (local) for code', selectedHsCode.code, ':', foundHsCode.restrictions);
          console.log('Restrictions count (local):', foundHsCode.restrictions.length);
        } else {
          console.log('No restrictions in local data for code', selectedHsCode.code, '- will try API.');
          // Fire-and-forget fetch to log restrictions while we already have parameters locally
          try {
            const respForRestrictions = await axios.get(`https://atfplatform.tw1.ru/api/declarations/${selectedHsCode.id}`);
            const findNodeByCodeLocal = (node, code) => {
              if (!node) return null;
              if (node.code === code) return node;
              if (Array.isArray(node.children)) {
                for (const child of node.children) {
                  const found = findNodeByCodeLocal(child, code);
                  if (found) return found;
                }
              }
              return null;
            };
            const nodeForRestrictions = findNodeByCodeLocal(respForRestrictions.data.hs_code, selectedHsCode.code);
            if (nodeForRestrictions && Array.isArray(nodeForRestrictions.restrictions)) {
              console.log('Restrictions (API-after-local) for code', selectedHsCode.code, ':', nodeForRestrictions.restrictions);
              console.log('Restrictions count (API-after-local):', nodeForRestrictions.restrictions.length);
            } else {
              console.log('No restrictions (API-after-local) for code', selectedHsCode.code);
            }
          } catch (e) {
            console.log('Failed to fetch restrictions via API-after-local', e);
          }
        }
        console.log('Parameters summary (local):', foundHsCode.parameters.map(p => ({ id: p.id, name: p?.name?.az || p?.name?.en || p?.name?.ru, category_id: p.category_id })));
        setTableData(foundHsCode.parameters);
        return;
      }
      
      // If not found in current data, try API call
      const response = await axios.get(`https://atfplatform.tw1.ru/api/declarations/${selectedHsCode.id}`);
      
      console.log('API Response:', response.data);
      
      // Extract parameters from the nested structure
      const allParameters = extractParameters(response.data.hs_code);
      
      console.log('Extracted parameters (API):', allParameters);
      console.log('Parameters count (API):', allParameters.length);
      console.log('Parameters summary (API):', allParameters.map(p => ({ id: p.id, name: p?.name?.az || p?.name?.en || p?.name?.ru, category_id: p.category_id })));

      // Find and log restrictions for the exact HS code node
      const findNodeByCode = (node, code) => {
        if (!node) return null;
        if (node.code === code) return node;
        if (Array.isArray(node.children)) {
          for (const child of node.children) {
            const found = findNodeByCode(child, code);
            if (found) return found;
          }
        }
        return null;
      };
      const exactNode = findNodeByCode(response.data.hs_code, selectedHsCode.code);
      if (exactNode && Array.isArray(exactNode.restrictions)) {
        console.log('Restrictions (API) for code', selectedHsCode.code, ':', exactNode.restrictions);
        console.log('Restrictions count (API):', exactNode.restrictions.length);
      } else {
        console.log('No restrictions found for code', selectedHsCode.code);
      }

      // Update table data with parameters
      setTableData(allParameters);
      
    } catch (error) {
      console.error('Error fetching parameters data:', error);
      const errorMessages = {
        en: "Error loading parameters data",
        ru: "Ошибка при загрузке данных параметров",
        az: "Parametr məlumatlarını yükləyərkən xəta baş verdi"
      };
      toast.error(errorMessages[language] || errorMessages.az);
      setTableData([]);
    }
  };

  const tabs = [
    {
      id: 'tariff',
      name: {
        az: 'Tarif dərəcələri',
        en: 'Tariff rates',
        ru: 'Тарифные ставки'
      }
    },
    {
      id: 'restrictions',
      name: {
        az: 'Qadağa və Məhdudiyyətlər',
        en: 'Prohibitions and Restrictions',
        ru: 'Запреты и ограничения'
      }
    },
    {
      id: 'quotas',
      name: {
        az: 'Kvotlar',
        en: 'Quotas',
        ru: 'Квоты'
      }
    },
    {
      id: 'declarations',
      name: {
        az: 'Bəyannamələrdən nümunələr',
        en: 'Examples from declarations',
        ru: 'Примеры из деклараций'
      }
    },
    {
      id: 'documents',
      name: {
        az: 'Təqdim edilmiş sənədlər',
        en: 'Submitted documents',
        ru: 'Представленные документы'
      }
    },
    {
      id: 'parameters',
      name: {
        az: 'Malın parametrləri',
        en: 'Product parameters',
        ru: 'Параметры товара'
      }
    }
  ];

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
        {/* Mobile Page Header */}
        <div className="md:hidden mb-4">
          <h1 className="text-[18px] font-semibold text-[#2E92A0]">HS Kodlar</h1>
        </div>
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
                        ) : !item.code ? (
                          <IoFolderOutline className="text-[#2E92A0]" />
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
          {!searchQuery && pagination.lastPage > 1 && (
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

      {/* Table Modal */}
      {showTable && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[1002] p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] overflow-hidden">
            {/* Table Header */}
            <div className="p-4 border-b border-[#E7E7E7] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#3F3F3F]">
                  {selectedHsCode?.code} - {typeof selectedHsCode?.name === 'string' 
                    ? selectedHsCode.name 
                    : selectedHsCode?.name?.az || selectedHsCode?.name?.en || selectedHsCode?.name?.ru || 'N/A'}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {language === 'en' ? 'Detailed Information' : 
                   language === 'ru' ? 'Подробная информация' : 
                   'Ətraflı məlumat'}
                </p>
              </div>
              <button
                onClick={closeTable}
                className="text-[#6B7280] hover:text-[#3F3F3F] text-2xl"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E7E7E7]">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#2E92A0] text-[#2E92A0]'
                        : 'border-transparent text-[#6B7280] hover:text-[#3F3F3F] hover:border-[#E7E7E7]'
                    }`}
                  >
                    {tab.name[language] || tab.name.az}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  {/* Tariff Rates Table */}
                  {activeTab === 'tariff' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Country' : 
                             language === 'ru' ? 'Страна' : 
                             'Ölkə'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Rate (%)' : 
                             language === 'ru' ? 'Ставка (%)' : 
                             'Dərəcə (%)'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Valid From' : 
                             language === 'ru' ? 'Действует с' : 
                             'Etibarlıdır'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(categoryDetails?.taxes) && categoryDetails.taxes.length > 0 ? (
                          categoryDetails.taxes.map((t, idx) => (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{t?.country || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{t?.rate ?? '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{t?.valid_from || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">-</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">{language === 'en' ? 'No data' : language === 'ru' ? 'Нет данных' : 'Məlumat yoxdur'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Restrictions Table */}
                  {activeTab === 'restrictions' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Restriction Type' : 
                             language === 'ru' ? 'Тип ограничения' : 
                             'Məhdudiyyət növü'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Description' : 
                             language === 'ru' ? 'Описание' : 
                             'Təsvir'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Status' : 
                             language === 'ru' ? 'Статус' : 
                             'Status'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(categoryDetails?.restrictions) && categoryDetails.restrictions.length > 0 ? (
                          categoryDetails.restrictions.map((r, idx) => (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                <div>{r?.category_name?.az || r?.category_name?.en || r?.category_name?.ru || '-'}</div>
                                <div className="text-xs text-[#6B7280] mt-1">
                                  {(r?.goods_code || r?.suffix || r?.match_indicator) ? (
                                    <span>
                                      {r?.goods_code ? `Kod: ${r.goods_code}` : ''}
                                      {r?.suffix ? `, Suffix: ${r.suffix}` : ''}
                                      {r?.match_indicator ? `, Match: ${r.match_indicator}` : ''}
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                <div>{r?.name?.az || r?.name?.en || r?.name?.ru || '-'}</div>
                                <div className="text-xs text-[#6B7280] mt-1">{r?.list_name?.az || r?.list_name?.en || r?.list_name?.ru || ''}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                <div>{r?.doc_name?.az || r?.doc_name?.en || r?.doc_name?.ru || '-'}</div>
                                <div className="text-xs text-[#6B7280] mt-1">{r?.doc_no || ''}</div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">{language === 'en' ? 'No data' : language === 'ru' ? 'Нет данных' : 'Məlumat yoxdur'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Quotas Table */}
                  {activeTab === 'quotas' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Quota Type' : 
                             language === 'ru' ? 'Тип квоты' : 
                             'Kvota növü'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Quantity' : 
                             language === 'ru' ? 'Количество' : 
                             'Miqdar'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Used' : 
                             language === 'ru' ? 'Использовано' : 
                             'İstifadə edilib'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(categoryDetails?.quotas) && categoryDetails.quotas.length > 0 ? (
                          categoryDetails.quotas.map((q, idx) => (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{q?.type || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{q?.quantity ?? '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{q?.used ?? '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">-</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">{language === 'en' ? 'No data' : language === 'ru' ? 'Нет данных' : 'Məlumat yoxdur'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Declarations Examples Table */}
                  {activeTab === 'declarations' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Declaration Number' : 
                             language === 'ru' ? 'Номер декларации' : 
                             'Bəyannamə nömrəsi'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Date' : 
                             language === 'ru' ? 'Дата' : 
                             'Kod'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Status' : 
                             language === 'ru' ? 'Статус' : 
                             'Status'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(categoryDetails?.declarations) && categoryDetails.declarations.length > 0 ? (
                          categoryDetails.declarations.map((d, idx) => (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{d?.name?.az || d?.name?.en || d?.name?.ru || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{d?.category_id || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">-</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">{language === 'en' ? 'No data' : language === 'ru' ? 'Нет данных' : 'Məlumat yoxdur'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Documents Table */}
                  {activeTab === 'documents' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Document Type' : 
                             language === 'ru' ? 'Тип документа' : 
                             'Sənəd növü'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'File Name' : 
                             language === 'ru' ? 'Имя файла' : 
                             'Fayl adı'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Upload Date' : 
                             language === 'ru' ? 'Дата загрузки' : 
                             'Yükləmə tarixi'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(categoryDetails?.documents) && categoryDetails.documents.length > 0 ? (
                          categoryDetails.documents.map((doc, idx) => (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{doc?.type?.az || doc?.type?.en || doc?.type?.ru || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{doc?.file_name || '-'}</td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">{doc?.uploaded_at || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">{language === 'en' ? 'No data' : language === 'ru' ? 'Нет данных' : 'Məlumat yoxdur'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Product Parameters Table */}
                  {activeTab === 'parameters' && (
                    <table className="w-full">
                      <thead className="bg-[#F9F9F9]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Parameter Name' : 
                             language === 'ru' ? 'Название параметра' : 
                             'Malın parametrləri'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Category ID' : 
                             language === 'ru' ? 'ID категории' : 
                             'Kateqoriya ID'}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#3F3F3F] border-b border-[#E7E7E7]">
                            {language === 'en' ? 'Note' : 
                             language === 'ru' ? 'Примечание' : 
                             'Qeyd'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((parameter, index) => (
                            <tr key={parameter.id || index} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                {parameter.name?.az || parameter.name?.en || parameter.name?.ru || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                {parameter.category_id || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-[#3F3F3F] border-b border-[#E7E7E7]">
                                {parameter.note?.az || parameter.note?.en || parameter.note?.ru || '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-[#6B7280]">
                              {language === 'en' ? 'No parameters data available' : 
                               language === 'ru' ? 'Данные о параметрах недоступны' : 
                               'Parametr məlumatları mövcud deyil'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-[#E7E7E7] flex justify-between items-center">
              {/* <div className="text-sm text-[#6B7280]">
                {language === 'en' ? 'Total items:' : 
                 language === 'ru' ? 'Всего элементов:' : 
                 'Ümumi element:'} {tableData.length}
              </div> */}
              <div className="flex gap-2">
                <button
                  onClick={closeTable}
                  className="px-4 py-2 text-[#6B7280] hover:text-[#3F3F3F] border border-[#E7E7E7] rounded-lg hover:bg-[#F5F5F5]"
                >
                  {language === 'en' ? 'Close' : 
                   language === 'ru' ? 'Закрыть' : 
                   'Bağla'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HsCodesPage;
