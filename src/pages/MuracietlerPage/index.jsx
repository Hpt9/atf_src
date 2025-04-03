import { useState, useEffect, useRef } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import HSCodeStep from './components/HSCodeStep';
import PermissionsStep from './components/PermissionsStep';
import FormStep from './components/FormStep';
import SuccessStep from './components/SuccessStep';

const MuracietlerPage = () => {
  const { setSearchBar } = useSearchBar();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [applications, setApplications] = useState([
    { id: 1, code: "TM188273", date: "12/12/2030", description: "TEST CARGO1" },
    { id: 2, code: "TM188273", date: "12/12/2030", description: "TEST CARGO2" },
    { id: 3, code: "TM188273", date: "12/12/2030", description: "TEST CARGO3" },
    { id: 4, code: "TM188273", date: "12/12/2030", description: "TEST CARGO4" },
    { id: 5, code: "TM188273", date: "12/12/2030", description: "TEST CARGO5" },
    { id: 6, code: "TM188273", date: "12/12/2030", description: "TEST CARGO6" },
    { id: 7, code: "TM188273", date: "12/12/2030", description: "TEST CARGO7" },
    { id: 8, code: "TM188273", date: "12/12/2030", description: "TEST CARGO8" },
    { id: 9, code: "TM188273", date: "12/12/2030", description: "TEST CARGO9" },
    { id: 10, code: "TM188273", date: "12/12/2030", description: "TEST CARGO10" },
    { id: 11, code: "TM188274", date: "15/12/2030", description: "TEST CARGO11" },
    { id: 12, code: "TM188275", date: "18/12/2030", description: "TEST CARGO12" },
    { id: 13, code: "TM188275", date: "18/12/2030", description: "TEST CARGO13" },
    { id: 14, code: "TM188275", date: "18/12/2030", description: "TEST CARGO14" },
    { id: 15, code: "TM188275", date: "18/12/2030", description: "TEST CARGO15" },
    { id: 16, code: "TM188275", date: "18/12/2030", description: "TEST CARGO16" },
    { id: 17, code: "TM188275", date: "18/12/2030", description: "TEST CARGO17" },
    { id: 18, code: "TM188275", date: "18/12/2030", description: "TEST CARGO18" },
    { id: 19, code: "TM188275", date: "18/12/2030", description: "TEST CARGO19" },
    { id: 20, code: "TM188275", date: "18/12/2030", description: "TEST CARGO20" },
    { id: 21, code: "TM188275", date: "18/12/2030", description: "TEST CARGO21" },
  ]);

  // Filter applications based on search query
  const filteredApplications = applications.filter(
    (app) =>
    app.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const [isMuracietModalOpen, setIsMuracietModalOpen] = useState(false);

  // Add useEffect for scroll blocking
  useEffect(() => {
    if (isMuracietModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMuracietModalOpen]);

  const toogleMuracietModal = () => {
    setIsMuracietModalOpen(!isMuracietModalOpen);
  };

  // Set the search bar when component mounts
  useEffect(() => {
    setSearchBar(
      <div className="flex items-center px-[16px] md:px-0 w-full md:w-[300px] ">
        <div className="relative w-[50%]">
          <input
            type="text"
            placeholder="Axtar"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <motion.button 
          className="ml-2 md:ml-4 px-4 py-2 bg-[#2E92A0] text-white rounded-lg flex items-center justify-between w-[50%]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toogleMuracietModal()}
        >
          <span className="mr-2">Müraciət et</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M20 12H4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    );
    
    // Clean up when component unmounts
    return () => setSearchBar(null);
  }, [setSearchBar, searchQuery]);

  // Animation variants for table rows
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
      },
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  // Improved height animation approach
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
      
      // Instead of using a fixed estimated height, use the previous height as a starting point
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

  // Add new state for modal steps
  const [modalStep, setModalStep] = useState(1);
  const [selectedHsCode, setSelectedHsCode] = useState("");

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    productName: "",
    invoiceValue: "",
    quantity: "",
    legalPersonName: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const closeModal = () => {
    setIsMuracietModalOpen(false);
    setModalStep(1);
    setSelectedHsCode("");
    setIsSuccess(false);
    setFormData({name: "",surname: "",productName: "",invoiceValue: "",quantity: "",legalPersonName: "",});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };
  const handleFormSubmit = () => {
    setIsSuccess(true);
  };

  return (
    <div className="w-full flex justify-center">
      {isMuracietModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[1000] flex items-center justify-center">
          <div className="bg-white rounded-[8px] w-[90%] max-w-[361px]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-[16px] border-b border-[#E7E7E7]">
              {modalStep === 3 && (
                <button
                  onClick={() => setModalStep(2)}
                  className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F5F5F5]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12H5M5 12L12 19M5 12L12 5"
                      stroke="#3F3F3F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              {!isSuccess && (
                <h2
                  className={`text-[18px] font-medium text-[#3F3F3F] ${
                    modalStep === 3 ? "flex-1 text-right" : ""
                  }`}
                >
                  {modalStep === 1
                    ? "HS Kodu"
                    : modalStep === 2
                    ? "İcazələr"
                    : "Seçilmiş icazələrə uyğun formu doldurun və təsdiq edin"}
                </h2>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-[16px] space-y-4">
              {isSuccess ? (
                <SuccessStep closeModal={closeModal} />
              ) : (
                <>
                  {modalStep === 1 ? (
                    <HSCodeStep 
                      selectedHsCode={selectedHsCode}
                      setSelectedHsCode={setSelectedHsCode}
                      closeModal={closeModal}
                      setModalStep={setModalStep}
                    />
                  ) : modalStep === 2 ? (
                    <PermissionsStep 
                      selectedHsCode={selectedHsCode}
                      setModalStep={setModalStep}
                      closeModal={closeModal}
                      selectedPermissions={selectedPermissions}
                      setSelectedPermissions={setSelectedPermissions}
                    />
                  ) : (
                    <FormStep 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      closeModal={closeModal}
                      handleFormSubmit={handleFormSubmit}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <div className="bg-white border border-[#E7E7E7] rounded-[8px] overflow-hidden">
          {/* Table Header */}
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7] bg-white">
            <div className="flex items-center gap-x-[8px]">
              <div 
                className="w-[64px] md:w-[150px] flex items-center cursor-pointer"
                onClick={() => handleSort("code")}
              >
                <p className="font-medium text-[#3F3F3F] text-[14px]">Kod</p>
                {sortField === "code" &&
                  (sortDirection === "asc" ? (
                    <IoIosArrowUp className="ml-1 text-[#3F3F3F]" />
                  ) : (
                    <IoIosArrowDown className="ml-1 text-[#3F3F3F]" />
                  ))}
              </div>
              <div 
                className="w-[75px] md:w-[150px] flex items-center gap-x-[8px] cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <p className="font-medium text-[#3F3F3F] text-[14px]">Tarix</p>
                <HiOutlineSwitchVertical />
              </div>
              <div className="w-[50px] md:w-[150px] flex items-center ">
                <p className="font-medium text-[#3F3F3F] text-[14px]">Qurum</p>
              </div>
            </div>
            <p className="font-medium text-[#3F3F3F] text-[14px] w-[40px] md-[80px] text-center">
              Yüklə
            </p>
          </div>
          
          {/* Improved animated container */}
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
                  currentItems.map((app) => (
                    <motion.div 
                      key={app.id} 
                      className="p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5]"
                      variants={rowVariants}
                    >
                      <div className="flex items-center gap-x-[8px]">
                        <p className="text-[#3F3F3F] text-[14px] w-[64px] md:w-[150px]">
                          {app.code}
                        </p>
                        <p className="text-[#3F3F3F] text-[14px] w-[75px] md:w-[150px]">
                          {app.date}
                        </p>
                        <p className="text-[#3F3F3F] text-[14px] w-[55px] mobile-sm:w-[80px] xs:w-[100px] md:w-[150px]">
                          {app.description}
                        </p>
                      </div>
                      <div className="w-[40px] md:w-[80px] flex justify-center">
                        <button className="text-[#2E92A0] hover:text-[#1E7A8A] transition-colors cursor-pointer">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 10L12 15L17 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 15V3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
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
          {filteredApplications.length > 0 && (
            <div className="pagination flex items-center justify-between p-4 border-t border-[#E7E7E7] bg-white">
              <div className="w-full justify-center flex items-center gap-2">
                <motion.button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-[16px] py-[3px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Geri
                </motion.button>
                
                {getPageNumbers().map((number) => (
                  <motion.button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                      currentPage === number 
                        ? "bg-[#2E92A0] text-white"
                        : "text-[#3F3F3F] border border-[#E7E7E7] hover:bg-[#E7E7E7]"
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
                  className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  İrəli
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuracietlerPage; 