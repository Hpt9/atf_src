import React, { useState, useEffect } from "react";
import { useSearchBar } from "../../context/SearchBarContext";
import useLanguageStore from "../../store/languageStore";
import { IoFilter } from "react-icons/io5";
import { Link } from 'react-router-dom';
const mockData = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  logo: "https://img.icons8.com/ios-filled/100/2E92A0/truck.png", // truck icon from icons8
  company: "Bridge Logistics",
  description:
    "Kabin nəqliyyatı və gömrük daxil olmaqla quru yükləşmə xidmətləri göstərir.",
  phone: "+994(50) 289-34-45",
  website: "bridgexapp.com",
}));

export const Kataloq = () => {
  const [page, setPage] = useState(1);
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchBar(
      <div className="relative w-full  md:w-[300px] px-[16px] md:px-0 md:pl-[16px] flex gap-2">
        <div className="flex items-center gap-2 relative w-full">
          <input
            type="text"
            placeholder={
              language === "az"
                ? "Axtar"
                : language === "en"
                ? "Search"
                : "Поиск"
            }
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
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
        <button
          className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] "
          onClick={() => {
            console.log("filter");
          }}
        >
          <IoFilter className="text-[20px]" />
          Filter
        </button>
      </div>
    );

    return () => setSearchBar(null);
  }, [setSearchBar, searchQuery, language]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        {/* Cards Grid */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.map((item) => (
            <Link
              key={item.id}
              to={`/dasinma/kataloq/${item.id}`}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition"
            >
              <div className="flex items-center justify-center h-[120px] bg-white border-b border-[#E7E7E7]">
                <img
                  src={item.logo}
                  alt={item.company}
                  className="max-h-[80px] max-w-[160px] object-contain"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">
                  {item.company}
                </h3>
                <p className="text-[#3F3F3F] text-[15px] mb-2">
                  {item.description}
                </p>
                <p className="text-[#A0A0A0] text-[13px] mt-auto mb-1">
                  {item.phone}
                </p>
                <a
                  href={`https://${item.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E92A0] text-[13px] underline"
                >
                  {item.website}
                </a>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">
            Geri
          </button>
          <button className="w-8 h-8 rounded bg-[#2E92A0] text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            2
          </button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            3
          </button>
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium">
            İrəli
          </button>
        </div>
      </div>
    </div>
  );
};
