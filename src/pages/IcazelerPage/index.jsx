import { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const IcazelerPage = () => {
  const { setSearchBar } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  // Sample data for permits
  const permits = Array(100).fill().map((_, index) => ({
    id: index + 1,
    name: `AQTA ${index}`,
    fullName: "Azərbaycan Food Security Agency",
    logo: "/src/assets/images/aqta-logo.png", // Replace with actual logo path
  }));

  // Filter permits based on search query
  const filteredPermits = permits.filter(permit => 
    permit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permit.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);
  
  // Get current items from filtered list
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPermits.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Change page
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

  // Generate page numbers
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
      <div className="relative w-full md:w-[300px] px-[16px]">
        <input
          type="text"
          placeholder="İcazələri axtar"
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

  // Animation variants
  const containerVariants = {
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const detailVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1920px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        <AnimatePresence mode="wait">
          {!selectedCard ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentItems.length > 0 ? (
                  currentItems.map((permit) => (
                    <motion.div
                      key={permit.id}
                      variants={cardVariants}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                      onClick={() => setSelectedCard(permit)}
                      className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden cursor-pointer"
                    >
                      <div className="relative">
                        <div className="h-[180px] bg-[#FAFAFA] flex items-center justify-center px-[32px] py-[16px] border-b border-[#E7E7E7]">
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-2">
                              {/* Replace with actual logo */}
                              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path d="M30,20 L70,20 L85,50 L70,80 L30,80 L15,50 L30,20 Z" fill="#f0f0f0" stroke="#d2a679" strokeWidth="2" />
                                <text x="50" y="55" fontSize="24" textAnchor="middle" fill="#333">AQTA</text>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <h3 className="text-left font-medium text-[#3F3F3F]">{permit.name}</h3>
                          <p className="text-left text-sm text-gray-600">{permit.fullName}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-4 p-[16px] text-center text-[#3F3F3F]">
                    Axtarışa uyğun nəticə tapılmadı
                  </div>
                )}
              </div>
              
              {/* Pagination - only show if we have items */}
              {filteredPermits.length > 0 && (
                <motion.div 
                  className="pagination flex items-center justify-center mt-8 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 } }}
                >
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className={`px-[16px] py-[3px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'}`}
                  >
                    Geri
                  </button>
                  
                  {getPageNumbers().map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 flex items-center justify-center rounded border border-[#E7E7E7] ${
                        currentPage === number 
                          ? 'bg-[#2E92A0] text-white border-none' 
                          : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#3F3F3F] hover:bg-[#E7E7E7]'}`}
                  >
                    İrəli
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Permit Detail View */
            <motion.div 
              key="detail"
              className="bg-white border border-[#E7E7E7] rounded-lg"
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header with back button */}
              <div className="p-4 border-b border-[#E7E7E7] flex items-center">
                <motion.button 
                  onClick={() => setSelectedCard(null)}
                  className="mr-4 text-[#3F3F3F] hover:text-[#2E92A0] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoArrowBack size={20} />
                </motion.button>
                {/* <h2 className="text-xl font-medium text-[#3F3F3F]">{selectedCard.name} İcazəsi</h2> */}
              </div>
              
              {/* Permit content */}
              <div className="p-6">
                <motion.div 
                  className="flex flex-col items-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                  <div className="w-full h-[100px] bg-[#FAFAFA] flex justify-center items-center">
                    logo
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#3F3F3F]">{selectedCard.name}</h3>
                    <p className="text-gray-600">{selectedCard.fullName}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                  <h4 className="text-md font-medium text-[#3F3F3F] mb-2">İcazə haqqında</h4>
                  <p className="text-gray-600">
                    Bu icazə Azərbaycan Respublikasının ərazisində qida təhlükəsizliyi sahəsində fəaliyyət göstərən müəssisələrə verilir. İcazə sahibi qida məhsullarının istehsalı, emalı, daşınması və satışı ilə məşğul ola bilər.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                >
                  <h4 className="text-md font-medium text-[#3F3F3F] mb-2">Tələb olunan sənədlər</h4>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Müəssisənin qeydiyyat sənədləri</li>
                    <li>Vergi ödəyicisinin qeydiyyat şəhadətnaməsi</li>
                    <li>Texniki təhlükəsizlik sertifikatı</li>
                    <li>İşçilərin tibbi müayinə kartları</li>
                    <li>Sanitariya-gigiyena sertifikatı</li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                >
                  <h4 className="text-md font-medium text-[#3F3F3F] mb-2">Müraciət prosesi</h4>
                  <ol className="list-decimal pl-5 text-gray-600">
                    <li>Elektron portal vasitəsilə qeydiyyatdan keçin</li>
                    <li>Tələb olunan sənədləri yükləyin</li>
                    <li>Müraciət formasını doldurun</li>
                    <li>Dövlət rüsumunu ödəyin</li>
                    <li>Müraciətin təsdiqlənməsini gözləyin</li>
                  </ol>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IcazelerPage; 