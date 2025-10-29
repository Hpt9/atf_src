import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowDown } from "react-icons/io";
import { useEffect } from 'react';
import axios from "axios";
import useLanguageStore from "../../store/languageStore";

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguageStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(faqData.length / itemsPerPage);

  // Text translations
  const texts = {
    loading: {
      en: "Loading FAQs...",
      ru: "Загрузка часто задаваемых вопросов...",
      az: "Suallar yüklənir..."
    },
    error: {
      en: "Failed to load FAQ data",
      ru: "Не удалось загрузить данные FAQ",
      az: "Sual-cavab məlumatlarını yükləmək mümkün olmadı"
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset openIndex when page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setOpenIndex(null); // Close any open accordion when changing pages
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate page numbers for pagination
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

  // Get page title based on language
  const getPageTitle = () => {
    switch(language) {
      case 'en':
        return 'Frequently Asked Questions';
      case 'ru':
        return 'Часто задаваемые вопросы';
      default:
        return 'Tez-tez verilən suallar';
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

  useEffect(() => {
    setLoading(true);
    axios.get("https://atfplatform.tw1.ru/api/faqs")
      .then((res) => {
        setFaqData(res.data);
        console.log(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(texts.error[language] || texts.error.az);
        console.error("Error fetching FAQs:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        {/* Mobile Page Header */}
        
        <h1 className="text-[20px] md:text-[32px] font-semibold text-[#2E92A0] mb-8">
          {getPageTitle()}
        </h1>

        <div className="space-y-4">
          {currentItems.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-[#E7E7E7] rounded-lg bg-[#FAFAFA] overflow-hidden"
            >
              <button
                className="w-full p-4 flex justify-between items-center text-left cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-[#3F3F3F] font-medium">{faq.question[language]}</span>
                <div
                  className={`transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <IoIosArrowDown className="text-[#2E92A0] text-xl" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#E7E7E7]"
                  >
                    <div 
                      className="p-4 text-[#3F3F3F] [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mb-1 [&>p]:mb-2"
                      dangerouslySetInnerHTML={{ __html: faq.answer[language] }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
              }`}
            >
              {getPaginationText().prev}
            </button>

            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                  currentPage === number
                    ? "bg-[#2E92A0] text-white"
                    : "text-[#3F3F3F] border border-[#E7E7E7] hover:bg-[#E7E7E7]"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-[16px] py-[3px] bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3F3F3F] hover:bg-[#E7E7E7]"
              }`}
            >
              {getPaginationText().next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqPage; 