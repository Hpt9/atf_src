import { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import { IoArrowBack } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import useLanguageStore from "../../store/languageStore";
import { useAuth } from "../../context/AuthContext";

const IcazelerPage = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalsData, setApprovalsData] = useState({
    data: [],
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
    links: [
      { label: '1', active: true }
    ]
  });

  // Fetch all approvals
  const fetchAllApprovals = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://atfplatform.tw1.ru/api/approvals?page=${page}`);
      // Handle array response from API
        setApprovalsData({
          data: response.data,
          total: response.data.length,
          per_page: response.data.length,
          current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
        links: [
          { label: '1', active: true }
        ]
      });
      setError(null);
    } catch (err) {
        console.error("Error fetching approvals:", err);
        setError("Məlumatları yükləyərkən xəta baş verdi");
      setApprovalsData({
        data: [],
        total: 0,
        per_page: 12,
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
        links: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Search approvals
  const searchApprovals = async (query) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://atfplatform.tw1.ru/api/approval-search',
        { q: query }
      );
      setApprovalsData({
        data: response.data,
        total: response.data.length,
        per_page: response.data.length,
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
        links: [
          { label: '1', active: true }
        ]
      });
      setError(null);
    } catch (err) {
      console.error("Error searching approvals:", err);
      setError("Axtarış zamanı xəta baş verdi");
      setApprovalsData({
        data: [],
        total: 0,
        per_page: 12,
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
        links: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load - fetch all approvals
  useEffect(() => {
    if (token) {
      fetchAllApprovals(1);
    }
  }, [token]);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchAllApprovals(currentPage);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchApprovals(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle page changes (only for non-search results)
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchAllApprovals(currentPage);
    }
  }, [currentPage]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Update search placeholder based on language
  const getSearchPlaceholder = () => {
    switch(language) {
      case 'en':
        return "Search permits";
      case 'ru':
        return "Поиск разрешений";
      default:
        return "İcazələri axtar";
    }
  };

  // Set the search bar when component mounts or language changes
  useEffect(() => {
    setSearchBar(
      <div className="relative w-full md:w-[300px] px-[16px]">
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
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

  // Get pagination text based on language
  const getPaginationText = () => {
    switch(language) {
      case 'en':
        return { prev: 'Previous', next: 'Next' };
      case 'ru':
        return { prev: 'Назад', next: 'Вперед' };
      default:
        return { prev: 'Əvvəl', next: 'Sonra' };
    }
  };

  // Get no results text based on language
  const getNoResultsText = () => {
    switch(language) {
      case 'en':
        return "No results found";
      case 'ru':
        return "Результаты не найдены";
      default:
        return "Axtarışa uyğun nəticə tapılmadı";
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        <AnimatePresence mode="wait">
          {!selectedCard ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {approvalsData.data?.length > 0 ? (
                      approvalsData.data.map((approval) => (
                        <motion.div
                          key={approval.id}
                          variants={cardVariants}
                          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                          onClick={() => setSelectedCard(approval)}
                          className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden cursor-pointer"
                        >
                          <div className="relative">
                            <div className="h-[180px] bg-[#FAFAFA] flex items-center justify-center px-[32px] py-[16px] border-b border-[#E7E7E7]">
                              <img 
                                src={`https://atfplatform.tw1.ru/storage/${approval.logo}`} 
                                alt={approval.title[language]}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="p-4 bg-white">
                              <h3 className="text-left font-medium text-[#3F3F3F]">{approval.title[language]}</h3>
                              <p className="text-left text-sm text-gray-600">{approval.alt_title[language]}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-4 p-[16px] text-center text-[#3F3F3F]">
                        {getNoResultsText()}
                      </div>
                    )}
                  </div>
                  
                  {approvalsData.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <motion.button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!approvalsData.prev_page_url}
                        className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${
                          !approvalsData.prev_page_url
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
                        }`}
                        whileHover={approvalsData.prev_page_url ? { scale: 1.05 } : {}}
                        whileTap={approvalsData.prev_page_url ? { scale: 0.95 } : {}}
                      >
                        {getPaginationText().prev}
                      </motion.button>

                      {approvalsData.links.slice(1, -1).map((link, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentPage(Number(link.label))}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                            link.active
                              ? "bg-[#2E92A0] text-white"
                              : "text-[#3F3F3F] border border-[#E7E7E7] hover:bg-[#E7E7E7]"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {link.label}
                        </motion.button>
                      ))}

                      <motion.button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!approvalsData.next_page_url}
                        className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${
                          !approvalsData.next_page_url
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
                        }`}
                        whileHover={approvalsData.next_page_url ? { scale: 1.05 } : {}}
                        whileTap={approvalsData.next_page_url ? { scale: 0.95 } : {}}
                      >
                        {getPaginationText().next}
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              className="bg-white border border-[#E7E7E7] rounded-lg"
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 border-b border-[#E7E7E7] flex items-center">
                <motion.button 
                  onClick={() => setSelectedCard(null)}
                  className="mr-4 text-[#3F3F3F] hover:text-[#2E92A0] transition-colors hover:cursor-pointer w-[30px] h-[30px] hover:scale-110 hover:bg-[#fafafa] rounded-[50%] flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoArrowBack size={20} />
                </motion.button>
                <h2 className="text-xl font-medium text-[#3F3F3F]">{selectedCard.title[language]}</h2>
              </div>
              
              <div className="p-6">
                <motion.div 
                  className="flex flex-col items-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                  <div className="w-full h-[200px] bg-[#FAFAFA] flex justify-center items-center mb-4">
                    <img 
                      src={`https://atfplatform.tw1.ru/storage/${selectedCard.logo}`}
                      alt={selectedCard.title[language]}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#3F3F3F]">{selectedCard.title[language]}</h3>
                    <p className="text-gray-600">{selectedCard.alt_title[language]}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                  <h4 className="text-md font-medium text-[#3F3F3F] mb-2">
                    {language === 'en' ? 'About the Permit' : 
                     language === 'ru' ? 'О разрешении' : 
                     'İcazə haqqında'}
                  </h4>
                  <div 
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: selectedCard.description[language] }}
                  />
                </motion.div>

                {selectedCard.requests && selectedCard.requests.length > 0 && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                  >
                    <h4 className="text-md font-medium text-[#3F3F3F] mb-2">
                      {language === 'en' ? 'Requests' : 
                       language === 'ru' ? 'Заявки' : 
                       'Müraciətlər'}
                    </h4>
                    <div className="space-y-4">
                      {selectedCard.requests.map((request) => (
                        <div key={request.id} className="p-4 bg-[#FAFAFA] rounded-lg">
                          <p className="text-[#3F3F3F] font-medium">
                            {language === 'en' ? 'Code: ' : 
                             language === 'ru' ? 'Код: ' : 
                             'Kod: '}{request.code}
                          </p>
                          <p className="text-gray-600">{request.organization[language]}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IcazelerPage; 