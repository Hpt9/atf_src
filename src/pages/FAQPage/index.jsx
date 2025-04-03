import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowDown } from "react-icons/io";

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 2,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 3,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 4,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 5,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 6,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 7,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 8,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 9,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 10,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 11,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 12,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 13,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 14,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 15,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    },
    {
      id: 16,
      question: "Sifarişlərin statusuna haradan baxa bilərəm?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(faqData.length / itemsPerPage);

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

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <h1 className="text-[32px] font-semibold text-[#2E92A0] mb-8">
          Tez-tez verilən suallar
        </h1>

        <div className="space-y-4">
          {currentItems.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-[#E7E7E7] rounded-lg bg-[#FAFAFA] overflow-hidden"
            >
              <motion.button
                className="w-full p-4 flex justify-between items-center text-left cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-[#3F3F3F] font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoIosArrowDown className="text-[#2E92A0] text-xl" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#E7E7E7]"
                  >
                    <div className="p-4 text-[#3F3F3F]">
                      {faq.answer}
                    </div>
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
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? 'text-gray-400 border-gray-200'
                  : 'text-[#3F3F3F] border-[#E7E7E7] hover:bg-[#E7E7E7]'
              }`}
            >
              Geri
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#2E92A0] text-white'
                    : 'text-[#3F3F3F] border border-[#E7E7E7] hover:bg-[#E7E7E7]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'text-gray-400 border-gray-200'
                  : 'text-[#3F3F3F] border-[#E7E7E7] hover:bg-[#E7E7E7]'
              }`}
            >
              İrəli
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqPage; 