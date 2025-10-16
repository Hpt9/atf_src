import { useState, useEffect, useRef } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import HSCodeStep from "./components/HSCodeStep";
import PermissionsStep from "./components/PermissionsStep";
import FormStep from "./components/FormStep";
import SuccessStep from "./components/SuccessStep";
import {
  modalOverlayAnimation,
  modalContentAnimation,
} from "./components/shared/animations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLanguageStore from "../../store/languageStore";
import { getTokenCookie } from '../../utils/cookieUtils';
import toast from 'react-hot-toast';
const MuracietlerPage = () => {
  const navigate = useNavigate();
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Text translations
  const texts = {
    search: {
      en: "Search",
      ru: "Поиск",
      az: "Axtar"
    },
    
    apply: {
      en: "Apply",
      ru: "Подать заявление",
      az: "Müraciət et"
    },
    code: {
      en: "Code",
      ru: "Код",
      az: "Kod"
    },
    document: {
      en: "Document",
      ru: "Документ",
      az: "Sənəd"
    },
    organization: {
      en: "Organization",
      ru: "Организация",
      az: "Qurum"
    },
    download: {
      en: "Download",
      ru: "Скачать",
      az: "Yüklə"
    },
    hsCode: {
      en: "HS Code",
      ru: "HS Код",
      az: "HS Kodu"
    },
    permissions: {
      en: "Permissions",
      ru: "Разрешения",
      az: "İcazələr"
    },
    noApplications: {
      en: "You don't have any applications at the moment",
      ru: "В настоящее время у вас нет заявлений",
      az: "Hazırda heç bir müraciətiniz yoxdur"
    },
    noResults: {
      en: "No results matching your search",
      ru: "Результаты не найдены",
      az: "Axtarışa uyğun nəticə tapılmadı"
    },
    loadingError: {
      en: "Failed to load data",
      ru: "Не удалось загрузить данные",
      az: "Məlumatları yükləmək mümkün olmadı"
    },
    previous: {
      en: "Previous",
      ru: "Назад",
      az: "Geri"
    },
    next: {
      en: "Next",
      ru: "Вперед",
      az: "İrəli"
    },
    hello: {
      en: "hello",
      ru: "привет",
      az: "salam"
    }
  };

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentName, setDocumentName] = useState();
  // console.log(documentName);
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://atfplatform.tw1.ru/api/requests",
        {
          headers: {
            Authorization: `Bearer ${getTokenCookie()}`,
          },
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setApplications([]);
        setError(null);
      } else {
        setError(texts.loadingError[language] || texts.loadingError.az);
        console.error("Error loading applications:", error);
      }
    } finally {
      // console.log(applications);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications based on search query
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;

    // Convert both the code and search query to strings for comparison
    const appCode = String(app.code);
    const query = searchQuery.trim();

    return appCode.includes(query);
  });

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
  // console.log(currentItems);
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
            placeholder={texts.search[language] || texts.search.az}
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
          <span className="mr-2 whitespace-nowrap">{texts.apply[language] || texts.apply.az}</span>
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
  }, [setSearchBar, searchQuery, language]);

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

  // Add new state for approval PDFs
  const [modalStep, setModalStep] = useState(1);
  const [selectedHsCode, setSelectedHsCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [approvalPdfs, setApprovalPdfs] = useState([]);

  const closeModal = () => {
    setIsMuracietModalOpen(false);
    setModalStep(1);
    console.log(selectedHsCode)
    setSelectedHsCode("");
    setIsSuccess(false);
    setApprovalPdfs([]);
  };

  // Add direction state to track navigation direction
  const [direction, setDirection] = useState(1);

  // Update the step change functions
  const goToNextStep = (nextStep) => {
    setDirection(1);
    setModalStep(nextStep);
  };

  const goToPrevStep = (prevStep) => {
    setDirection(-1);
    setModalStep(prevStep);
  };

  // State for info popover
  const [selectedApp, setSelectedApp] = useState(null);
  const [isInfoPopoverOpen, setIsInfoPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Handle info popover
  const handleInfoClick = (app, event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    setSelectedApp(app);
    setPopoverPosition({
      x: rect.left - 300, // Position to the left of the button
      y: rect.bottom + 8
    });
    setIsInfoPopoverOpen(true);
  };

  const closeInfoPopover = () => {
    setIsInfoPopoverOpen(false);
    setSelectedApp(null);
  };

  // Handle PDF link click
  const handlePDFLinkClick = (pdfSlug) => {
    const pdfUrl = `https://atfplatform.tw1.ru/storage/${pdfSlug}`;
    window.open(pdfUrl, '_blank');
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isInfoPopoverOpen && !event.target.closest('.popover-container')) {
        closeInfoPopover();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInfoPopoverOpen]);

  // Update the render logic to handle loading and empty states
  if (isLoading) {
    return (
      <div className="w-full flex justify-center max-h-[calc(100vh-303px)]">
        <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
          <div className="w-full h-[400px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <AnimatePresence>
        {isMuracietModalOpen && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[1001] flex items-center justify-center"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalOverlayAnimation}
          >
            <motion.div
              className="bg-white rounded-[8px] w-[90%] max-w-[361px]"
              variants={modalContentAnimation}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-[16px] border-b border-[#E7E7E7]">
                {modalStep === 2 && (
                  <button
                    onClick={() => setModalStep(1)}
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
                      modalStep === 2 ? "flex-1 text-right" : ""
                    }`}
                  >
                    {modalStep === 1 ? texts.hsCode[language] || texts.hsCode.az : texts.permissions[language] || texts.permissions.az}
                  </h2>
                )}
              </div>

              {/* Modal Content */}
              <div className="p-[16px] space-y-4 overflow-y-auto max-h-[80vh]">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  {modalStep === 3 ? (
                    <SuccessStep
                      key="success"
                      closeModal={closeModal}
                      custom={direction}
                      approvalPdfs={approvalPdfs}
                      refreshApplications={fetchApplications}
                    />
                  ) : (
                    <>
                      {modalStep === 1 ? (
                        <HSCodeStep
                          key="step1"
                          selectedHsCode={selectedHsCode}
                          setSelectedHsCode={setSelectedHsCode}
                          closeModal={closeModal}
                          setModalStep={goToNextStep}
                          custom={direction}
                        />
                      ) : (
                        <PermissionsStep
                          key="step2"
                          selectedHsCode={selectedHsCode}
                          setModalStep={(step) =>
                            step < 2 ? goToPrevStep(step) : goToNextStep(step)
                          }
                          closeModal={closeModal}
                          custom={direction}
                          setApprovalPdfs={setApprovalPdfs}
                          refreshApplications={fetchApplications}
                          setDocumentName={setDocumentName}
                        />
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
                 )}
       </AnimatePresence>

               {/* Info Popover */}
        <AnimatePresence>
          {isInfoPopoverOpen && selectedApp && (
            <motion.div
              className="fixed z-[1001] popover-container"
                             style={{
                 left: popoverPosition.x,
                 top: popoverPosition.y,
                 transform: 'translateX(-100%)'
               }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-lg border border-[#E7E7E7] p-4 min-w-[300px] max-w-[400px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[#3F3F3F]">HS Kod:</span>
                    <span className="text-[14px] text-[#3F3F3F]">
                      {selectedApp.code < 10 ? "0" + selectedApp.code : selectedApp.code}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-[14px] font-medium text-[#3F3F3F]">Sənədlər:</span>
                    <div className="flex flex-col gap-1">
                      {selectedApp.approval_titles && selectedApp.approval_titles.map((title, index) => (
                        <span key={index} className="text-[14px] text-[#3F3F3F]">
                          {title.az}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedApp.pdf_slug && selectedApp.pdf_slug.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[14px] font-medium text-[#3F3F3F]">PDF Sənədlər:</span>
                      <div className="space-y-1">
                        {selectedApp.pdf_slug.map((pdf) => (
                          <button
                            key={pdf.id}
                            onClick={() => handlePDFLinkClick(pdf.slug)}
                            className="w-full text-left p-2 border border-[#E7E7E7] rounded hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 2V8H20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-[14px] text-[#2E92A0] hover:text-[#1E7A8A]">
                                {pdf.slug.split('/').pop()}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[14px] text-gray-500">
                      No PDF files available for this application.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <div className="bg-white border border-[#E7E7E7] rounded-[8px] overflow-hidden">
          {/* Table Header */}
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7] bg-white">
            <div className="flex items-center gap-x-[8px]">
              <div
                className="w-[64px] md:w-[150px] flex items-center cursor-pointer"
                onClick={() => handleSort("code")}
              >
                <p className="font-medium text-[#3F3F3F] text-[14px]">{texts.code[language] || texts.code.az}</p>
                {sortField === "code" &&
                  (sortDirection === "asc" ? (
                    <IoIosArrowUp className="ml-1 text-[#3F3F3F]" />
                  ) : (
                    <IoIosArrowDown className="ml-1 text-[#3F3F3F]" />
                  ))}
              </div>
              <div className="w-[75px] md:w-[150px] flex items-center gap-x-[8px] cursor-pointer">
                <p className="font-medium text-[#3F3F3F] text-[14px]">{texts.document[language] || texts.document.az}</p>
              </div>
              <div className="w-[50px] md:w-[150px] flex items-center ">
                <p className="font-medium text-[#3F3F3F] text-[14px]">{texts.organization[language] || texts.organization.az}</p>
              </div>
            </div>
                         <p className="font-medium text-[#3F3F3F] text-[14px] w-[40px] md:w-[80px] text-center">
               Info
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
                  if (newContentRef.current) {
                    setContentHeight(newContentRef.current.offsetHeight);
                  }
                }}
              >
                {applications.length === 0 ? (
                  <motion.div
                    className="p-[16px] text-center text-[#3F3F3F] flex flex-col items-center justify-center space-y-4"
                    variants={rowVariants}
                  >
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => toogleMuracietModal()}
                      className="hover:cursor-pointer hover:scale-105 transition-all duration-200 group"
                    >
                      <path
                        d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#A0A0A0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-[#2E92A0] transition-all duration-200"
                      />
                    </svg>
                    <p>{texts.noApplications[language] || texts.noApplications.az}</p>
                  </motion.div>
                ) : currentItems.length > 0 ? (
                  currentItems.reverse().map((app) => (
                    <motion.div
                      key={app.id}
                      className="p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5]"
                      variants={rowVariants}
                    >
                      <div className="flex items-center gap-x-[8px]">
                        <p className="text-[#3F3F3F] text-[14px] w-[64px] md:w-[150px]">
                          {app.code<10 ? "0"+app.code : app.code}
                        </p>
                        <p className="text-[#3F3F3F] text-[14px] w-[75px] md:w-[150px]">
                        {Array.isArray(app.approval_titles) && app.approval_titles.length > 0
                            ? app.approval_titles.map((title, index) => {
                                const text = (title && (title[language] || title.az)) || (typeof title === 'string' ? title : '');
                                const suffix = index < app.approval_titles.length - 1 ? ', ' : '';
                                return text + suffix;
                              })
                            : texts.hello[language] || texts.hello.az}
                        </p>
                        <p className="text-[#3F3F3F] text-[14px] w-[55px] mobile-sm:w-[80px] xs:w-[100px] md:w-[150px]">
                        {app.organization?.[language] || app.organization?.az || (typeof app.organization === 'string' ? app.organization : (texts.hello[language] || texts.hello.az))}
                        </p>
                      </div>
                                             <div className="w-[40px] md:w-[80px] flex justify-center">
                                                   <button 
                            className="text-[#2E92A0] hover:text-[#1E7A8A] transition-colors cursor-pointer"
                            onClick={(e) => handleInfoClick(app, e)}
                          >
                           <svg
                             width="24"
                             height="24"
                             viewBox="0 0 24 24"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg"
                           >
                             <path
                               d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                               stroke="currentColor"
                               strokeWidth="2"
                               strokeLinecap="round"
                               strokeLinejoin="round"
                             />
                             <path
                               d="M12 16V12"
                               stroke="currentColor"
                               strokeWidth="2"
                               strokeLinecap="round"
                               strokeLinejoin="round"
                             />
                             <path
                               d="M12 8H12.01"
                               stroke="currentColor"
                               strokeWidth="2"
                               strokeLinecap="round"
                               strokeLinejoin="round"
                             />
                           </svg>
                         </button>
                       </div>
                      {/* <div className="w-[40px] md:w-[80px] flex justify-end">
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
                      </div> */}
                    </motion.div>
                    
                  ))
                ) : (
                  <motion.div
                    className="p-[16px] text-center text-[#3F3F3F]"
                    variants={rowVariants}
                  >
                    {texts.noResults[language] || texts.noResults.az}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {applications.length > 0 && filteredApplications.length > 0 && (
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
                  {texts.previous[language] || texts.previous.az}
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
                  {texts.next[language] || texts.next.az}
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
