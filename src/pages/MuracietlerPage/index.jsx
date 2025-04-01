import { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";

const MuracietlerPage = () => {
  const { setSearchBar } = useSearchBar();
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([
    { id: 1, code: "TM188273", date: "12/12/2030", description: "TEST CARGO" },
    { id: 2, code: "TM188274", date: "15/12/2030", description: "TEST CARGO" },
    { id: 3, code: "TM188275", date: "18/12/2030", description: "TEST CARGO" },
    { id: 4, code: "TM188276", date: "20/12/2030", description: "TEST CARGO" },
    { id: 5, code: "TM188277", date: "22/12/2030", description: "TEST CARGO" },
    { id: 6, code: "TM188278", date: "25/12/2030", description: "TEST CARGO" },
    { id: 7, code: "TM188279", date: "28/12/2030", description: "TEST CARGO" },
    { id: 8, code: "TM188280", date: "30/12/2030", description: "TEST CARGO" },
    { id: 9, code: "TM188281", date: "02/01/2031", description: "TEST CARGO" },
    { id: 10, code: "TM188282", date: "05/01/2031", description: "TEST CARGO" },
  ]);

  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set the search bar when component mounts
  useEffect(() => {
    setSearchBar(
      <div className="flex items-center">
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Müraciət kodunu axtar"
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
        <button className="ml-4 px-4 py-2 bg-[#2E92A0] text-white rounded-lg flex items-center">
          <span className="mr-2">Müraciət et</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className="bg-white border border-[#E7E7E7] rounded-[8px]">
          <div className="p-[16px] flex justify-between items-center border-b border-[#E7E7E7]">
            <div className="flex items-center gap-x-[100px]">
              <p className="font-medium text-[#3F3F3F] text-[14px]">Kod</p>
              <p className="font-medium text-[#3F3F3F] text-[14px]">Tarix</p>
              <p className="font-medium text-[#3F3F3F] text-[14px]">Qurum</p>
            </div>
            <p className="font-medium text-[#3F3F3F] text-[14px]">Yüklə</p>
          </div>
          
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div key={app.id} className="p-[16px] flex justify-between items-center border-t border-[#E7E7E7] hover:bg-[#F5F5F5]">
                <div className="flex items-center gap-x-[100px]">
                  <p className="text-[#3F3F3F] text-[14px]">{app.code}</p>
                  <p className="text-[#3F3F3F] text-[14px]">{app.date}</p>
                  <p className="text-[#3F3F3F] text-[14px]">{app.description}</p>
                </div>
                <button className="text-[#2E92A0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="p-[16px] text-center text-[#3F3F3F]">
              Axtarışa uyğun nəticə tapılmadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuracietlerPage; 