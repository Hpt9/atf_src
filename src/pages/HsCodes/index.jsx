import { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown, IoIosArrowForward as IoIosArrowRight } from "react-icons/io";
import { useSearchBar } from "../../context/SearchBarContext";
import { motion, AnimatePresence } from "framer-motion";

const HsCodesPage = () => {
  const { setSearchBar } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const itemsPerPage = 10;
  const contentRef = useRef(null);

  // Updated hierarchical data structure for HS codes
  const hs_codes_data = [
    {
      id: "I",
      name: "CANLI HEYVANLAR; HEYVAN MƏNŞƏLİ MƏHSULLAR",
      isGroup: true,
      children: [
        {
          id: "01",
          name: "Canlı heyvanlar",
          isGroup: true,
          children: [
            { id: "0101", name: "Canlı atlar, eşşəklər, qatırlar və xəçərlər", isGroup: false },
            { id: "0102", name: "Canlı iribuynuzlu mal-qara", isGroup: false },
            { id: "0103", name: "Canlı donuzlar", isGroup: false },
            { id: "0104", name: "Canlı qoyunlar və keçilər", isGroup: false },
          ]
        },
        {
          id: "02",
          name: "Ət və əlavə ət məhsulları",
          isGroup: true,
          children: [
            { id: "0201", name: "İribuynuzlu mal-qaranın əti, təzə və ya soyudulmuş", isGroup: false },
            { id: "0202", name: "İribuynuzlu mal-qaranın əti, dondurulmuş", isGroup: false },
            { id: "0203", name: "Donuz əti, təzə, soyudulmuş və ya dondurulmuş", isGroup: false },
          ]
        }
      ]
    },
    {
      id: "II",
      name: "BİTKİ MƏNŞƏLİ QIDALAR",
      isGroup: true,
      children: [
        {
          id: "06",
          name: "Canlı ağaclar və digər bitkilər",
          isGroup: true,
          children: [
            { id: "0601", name: "Soğanaqlar, köklər və s.", isGroup: false },
            { id: "0602", name: "Digər canlı bitkilər", isGroup: false },
          ]
        },
        {
          id: "07",
          name: "Yeməli tərəvəzlər və bəzi köklər və yumrular",
          isGroup: true,
          children: [
            { id: "0701", name: "Kartof, təzə və ya soyudulmuş", isGroup: false },
            { id: "0702", name: "Pomidor, təzə və ya soyudulmuş", isGroup: false },
          ]
        }
      ]
    },
    {
      id: "III",
      name: "HEYVAN, BİTKİ VƏ YA MİKROBİOLOJİ MƏNŞƏLİ PİYLƏR VƏ YAĞLAR VƏ YA ",
      isGroup: true,
      children: [
        {
          id: "15",
          name: "Heyvan və ya bitki mənşəli piylər və yağlar",
          isGroup: true,
          children: [
            { id: "1501", name: "Donuz piyi və digər donuz yağları", isGroup: false },
            { id: "1502", name: "İribuynuzlu mal-qara, qoyun və ya keçi yağları", isGroup: false },
          ]
        }
      ]
    }
  ];

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
  const flattenData = (data, level = 0, parentExpanded = true) => {
    let result = [];
    
    data.forEach(item => {
      // Only include items whose parents are expanded
      if (parentExpanded) {
        // Add the current item
        result.push({
          ...item,
          level,
          visible: true
        });
        
        // If this is a group and it's expanded, add its children
        if (item.isGroup && item.children && isExpanded(item.id)) {
          result = [...result, ...flattenData(item.children, level + 1, true)];
        }
      }
    });
    
    return result;
  };

  // Filter and flatten the data
  const getFilteredAndFlattenedData = () => {
    if (!searchQuery) {
      return flattenData(hs_codes_data);
    }
    
    // For search, we'll show all matching items and their parents
    const searchLower = searchQuery.toLowerCase();
    const matches = new Set();
    
    // First pass: find all matches and their parent chains
    const findMatches = (items, parentChain = []) => {
      items.forEach(item => {
        const itemMatches = item.name.toLowerCase().includes(searchLower);
        
        if (itemMatches) {
          // Add this item and all its parents to matches
          matches.add(item.id);
          parentChain.forEach(parentId => matches.add(parentId));
        }
        
        // Check children recursively
        if (item.isGroup && item.children) {
          findMatches(item.children, [...parentChain, item.id]);
        }
      });
    };
    
    findMatches(hs_codes_data);
    
    // Second pass: create a filtered and flattened list
    const filterAndFlatten = (items, level = 0) => {
      let result = [];
      
      items.forEach(item => {
        const itemMatches = matches.has(item.id);
        
        if (itemMatches) {
          result.push({
            ...item,
            level,
            visible: true
          });
          
          // If this is a group, always include its children in search results
          if (item.isGroup && item.children) {
            result = [...result, ...filterAndFlatten(item.children, level + 1)];
          }
        }
      });
      
      return result;
    };
    
    return filterAndFlatten(hs_codes_data);
  };

  const filteredHsCodes = getFilteredAndFlattenedData();
  
  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(filteredHsCodes.length / itemsPerPage);
  
  // Get current items from filtered list
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHsCodes.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  // Set the search bar when component mounts
  useEffect(() => {
    setSearchBar(
      <div className="relative w-full md:w-[300px] px-[16px] md:px-0">
        <input
          type="text"
          placeholder="HS Kodunu yoxlayın"
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute right-7 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
    
    // Clean up when component unmounts
    return () => setSearchBar(null);
  }, [setSearchBar, searchQuery]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <div className="bg-white border border-[#E7E7E7] rounded-[8px] overflow-hidden">
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7]">
            <div className="flex items-center mobile:gap-x-[16px] lg:gap-x-[100px]">
              <p className="font-medium text-[#3F3F3F] text-[14px] w-[60px]">Kod</p>
              <p className="font-medium text-[#3F3F3F] text-[14px]">HS adı</p>
            </div>
            <p className="font-medium text-[#3F3F3F] text-[14px]">Əməliyyatlar</p>
          </div>
          
          {/* Scrollable content container */}
          <div 
            ref={contentRef}
            className="max-h-[640px] overflow-y-auto"
          >
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredHsCodes.length > 0 ? (
                filteredHsCodes.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className={`p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5] ${
                      item.level === 0 ? 'bg-[#F9F9F9]' : 
                      item.level === 1 ? 'bg-[#FCFCFC]' : 
                      'bg-white'
                    } ${item.isGroup ? 'cursor-pointer' : ''}`}
                    onClick={item.isGroup ? () => toggleGroup(item.id) : undefined}
                    variants={rowVariants}
                  >
                    <div className="flex items-center w-full gap-x-[]">
                      {/* Indentation based on level */}
                      <div style={{ width: `${item.level * 24}px` }} className="flex-shrink-0"></div>
                      
                      {/* Toggle indicator (not a button anymore) */}
                      {item.isGroup ? (
                        <div className="mr-2 text-[#3F3F3F] flex-shrink-0">
                          {isExpanded(item.id) ? 
                            <IoIosArrowDown className="text-[#2E92A0]" /> : 
                            <IoIosArrowRight className="text-[#2E92A0]" />
                          }
                        </div>
                      ) : (
                        <div className="mr-2 w-4 flex-shrink-0"></div> // Spacer for alignment
                      )}
                      
                      {/* Content with different styling based on level */}
                      <div className="flex items-center w-full gap-x-[8px]">
                        <p className={`text-[#3F3F3F] text-[14px] w-fit md:w-[20px] ${
                          item.level === 0 ? 'font-bold' : 
                          item.level === 1 ? 'font-medium' : 
                          'font-normal'
                        }`}>
                          {item.id}
                        </p>
                        <p className={`text-[#3F3F3F] text-[14px] ${
                          item.level === 0 ? 'font-bold uppercase' : 
                          item.level === 1 ? 'font-medium' : 
                          'font-normal'
                        }`}>
                          {item.name}
                        </p>
                      </div>
                    </div>
                    
                    {/* Add stopPropagation to prevent row click when clicking buttons */}
                    <div className="flex items-center gap-x-[8px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E7E7E7]">
                        <LuInfo className="w-[20px] h-[20px] text-[#2E92A0]" />
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E7E7E7]">
                        <FaRegFilePdf className="w-[20px] h-[20px] text-[#2E92A0]" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="p-[16px] text-center text-[#3F3F3F]"
                  variants={rowVariants}
                >
                  Axtarışa uyğun nəticə tapılmadı
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HsCodesPage;
