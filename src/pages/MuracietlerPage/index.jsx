import { useSearchBar } from "../../context/SearchBarContext";
import { useEffect } from "react";

const MuracietlerPage = () => {
  const { setSearchBar } = useSearchBar();
  useEffect(() => {
    setSearchBar(
      <div className="relative w-[300px]">
        <input
          type="text"
          placeholder="Muracietler"
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Müraciətlər</h1>
      {/* Add your content here */}
    </div>
  )
}

export default MuracietlerPage 