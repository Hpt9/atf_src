import { useState, useEffect, useRef } from "react";
import { LuInfo } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSearchBar } from "../../context/SearchBarContext";
import { motion, AnimatePresence } from "framer-motion";

const HsCodesPage = () => {
  const { setSearchBar } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const hs_codes = [
    {
      id: 1,
      name: "Canlı ferid; Heyvan mənşəli məhsullar",
    },
    {
      id: 2,
      name: "Canlı feride; Heyvan mənşəli məhsullar",
    },
    {
      id: 3,
      name: "Canlı leyla; Heyvan mənşəli məhsullar",
    },
    {
      id: 4,
      name: "Canlı pakize; Heyvan mənşəli məhsullar",
    },
    {
      id: 5,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 6,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 7,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 8,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 9,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 10,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 11,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 12,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 13,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 14,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 15,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 16,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 17,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 18,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 19,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 20,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 21,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 22,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 23,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
    {
      id: 24,
      name: "Canlı heyvanlar; Heyvan mənşəli məhsullar",
    },
  ];

  // Filter hs_codes based on search query
  const filteredHsCodes = hs_codes.filter(code => 
    code.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
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
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Height animation approach
  const [contentHeight, setContentHeight] = useState("auto");
  const prevPageRef = useRef(currentPage);
  const newContentRef = useRef(null);
  const prevContentRef = useRef(null);
  
  // Update height immediately when page changes
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      // Store the previous content height
      if (newContentRef.current) {
        prevContentRef.current = newContentRef.current.offsetHeight;
      }
      
      // Use the previous height as a starting point
      if (prevContentRef.current) {
        setContentHeight(prevContentRef.current);
      } else {
        // Only use this fallback for the first render
        setContentHeight("auto");
      }
      
      prevPageRef.current = currentPage;
      
      // Schedule a measurement after render
      requestAnimationFrame(() => {
        if (newContentRef.current) {
          setContentHeight(newContentRef.current.offsetHeight);
        }
      });
    }
  }, [currentPage]);

  // Change page - reset the view when changing pages
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Generate page numbers - limit to 5 visible pages
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // Set the search bar when component mounts
  useEffect(() => {
    setSearchBar(
      <div className="relative w-[300px]">
        <input
          type="text"
          placeholder="HS Kodunu yoxlayın"
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
      <div className="w-full max-w-[1920px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#3F3F3F]">HS Kodlar</h1>
        </div> */}
        
        <div className="bg-white border border-[#E7E7E7] rounded-[8px] overflow-hidden">
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7]">
            <div className="flex items-center mobile:gap-x-[16px] lg:gap-x-[100px]">
              <p className="font-medium text-[#3F3F3F] text-[14px] w-[20px]">#</p>
              <p className="font-medium text-[#3F3F3F] text-[14px]">HS adı</p>
            </div>
            <p className="font-medium text-[#3F3F3F] text-[14px]">Əməliyyatlar</p>
          </div>
          
          {/* Animated container with dynamic height */}
          <motion.div
            style={{ height: contentHeight }}
            animate={{ height: contentHeight }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                ref={newContentRef}
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onAnimationStart={() => {
                  // Fine-tune height as soon as animation starts
                  if (newContentRef.current) {
                    setContentHeight(newContentRef.current.offsetHeight);
                  }
                }}
              >
                {currentItems.length > 0 ? (
                  currentItems.map((hs_code) => (
                    <motion.div 
                      key={hs_code.id} 
                      className="hs_row p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5]"
                      variants={rowVariants}
                    >
                      <div className="flex items-center mobile:gap-x-[16px] lg:gap-x-[100px]">
                        <p className="text-[#3F3F3F] text-[14px] w-[20px]">{hs_code.id}</p>
                        <p className="text-[#3F3F3F] text-[14px]">{hs_code.name}</p>
                      </div>
                      <div className="flex items-center gap-x-[8px]">
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
            </AnimatePresence>
          </motion.div>
          
          {/* Pagination */}
          {filteredHsCodes.length > 0 && (
            <div className="pagination flex items-center justify-between p-4 border-t border-[#E7E7E7]">
              {/* <div>
                <span className="text-sm text-[#3F3F3F]">Geriyə</span>
              </div> */}
              <div className="w-full justify-center flex items-center gap-2">
                <motion.button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-[16px] py-[3px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'}`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Geri
                </motion.button>
                
                {getPageNumbers().map(number => (
                  <motion.button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded border border-[#E7E7E7] ${
                      currentPage === number 
                        ? 'bg-[#2E92A0] text-white border-none' 
                        : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {number}
                  </motion.button>
                ))}
                
                <motion.button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'}`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  İrəli
                </motion.button>
              </div>
              {/* <div>
                <span className="text-sm text-[#3F3F3F]">İrəli</span>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HsCodesPage;
