import { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";

const IcazelerPage = () => {
  const { setSearchBar } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const itemsPerPage = 12;

  // Sample data for permits
  const permits = Array(50).fill().map((_, index) => ({
    id: index + 1,
    name: `AQTA ${index}`,
    fullName: "Azərbaycan Food Security Agency",
    logo: "/src/assets/images/aqta-logo.png", // Replace with actual logo path
  }));

  // Calculate total pages
  const totalPages = Math.ceil(permits.length / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = permits.slice(indexOfFirstItem, indexOfLastItem);

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
      <div className="relative w-[300px]">
        <input
          type="text"
          placeholder="İcazələri axtar"
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
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
  }, [setSearchBar]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1920px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems.map((permit) => (
            <div 
              key={permit.id} 
              className="border border-[#E7E7E7] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCard(permit)}
            >
              <div className="relative">
                <div className="h-[180px] bg-white flex items-center justify-center p-4 border-b border-[#E7E7E7]">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-2">
                      {/* Replace with actual logo */}
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M30,20 L70,20 L85,50 L70,80 L30,80 L15,50 L30,20 Z" fill="#f0f0f0" stroke="#d2a679" strokeWidth="2" />
                        <text x="50" y="55" fontSize="24" textAnchor="middle" fill="#333">AQTA</text>
                      </svg>
                    </div>
                  </div>
                  {/* Badge for 24/7 */}
                  {/* <div className="absolute top-2 right-2 bg-[#FF4081] text-white text-xs font-bold px-2 py-1 rounded">
                    24
                  </div> */}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-center font-medium text-[#3F3F3F]">{permit.name}</h3>
                  <p className="text-center text-sm text-gray-600">{permit.fullName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination flex items-center justify-center mt-8 gap-2">
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
        </div>

        {/* Modal for selected card */}
        
      </div>
    </div>
  );
};

export default IcazelerPage; 