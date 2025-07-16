import React, { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const mockData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Moskva – Bakı',
    subtitle: 'Bütün yüklərin daşınması',
    date: '20 Mart 2025 (13:00) – 21 Mart 2025 (17:00)',
    direction:"incoming"
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Bakı – Moskva',
    subtitle: 'Bütün yüklərin daşınması',
    date: '20 Mart 2025 (13:00) – 21 Mart 2025 (17:00)',
    direction:"outgoing"
  }
];
while (mockData.length < 12) {
  mockData.push({ ...mockData[0], id: mockData.length + 1 });
}

const tabs = [
  { label: 'Hamısı', value: 'all' },
  { label: 'Gələn', value: 'incoming' },
  { label: 'Gedən', value: 'outgoing' },
];

export const Elanlar = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  // Filter form state (mock, not functional)
  const [filter, setFilter] = useState({
    from: '',
    to: '',
    startDate: '',
    endDate: '',
    amount: '',
    unit: 'Vahid',
    truckType: '',
  });

  // Filter data based on activeTab
  const filteredData = activeTab === 'all'
    ? mockData
    : mockData.filter(item => item.direction === activeTab);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex">
            {tabs.map((tab, index) => (
              <button
                key={tab.value}
                className={`px-6 py-2 font-medium text-[16px] border transition-colors duration-150 ${
                  activeTab === tab.value
                    ? 'bg-[#2E92A0] text-white border-[#2E92A0]'
                    : 'bg-white text-[#2E92A0] border-[#2E92A0] hover:bg-[#2E92A0] hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.value)}
                style={{
                    borderRadius: index === 0 ? '8px 0 0 8px' : index === tabs.length - 1 ? '0 8px 8px 0' : '0',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px]"
            onClick={() => setShowFilter(true)}
          >
            <IoFilter className="text-[20px]" />
            Filter
          </button>
        </div>
        {/* Filter Modal */}
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
        {showFilter && (
          <div className='absolute right-0 w-full md:w-[404px] bg-white shadow-xl z-[1000] flex flex-col p-[32px] rounded-[8px]'>
            {/* Right-side drawer */}
            <div className="flex flex-col">
              <button
                className=" w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0] hover:cursor-pointer"
                onClick={() => setShowFilter(false)}
              >
                <IoClose size={24} />
              </button>
              <form className="flex flex-col gap-4 mt-4">
                <div className="flex w-full">
                  <input type="text" placeholder="Çıxma vaxtı" className="h-[48px] px-4 py-2 w-1/2 rounded-l-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none"  />
                  <input type="text" placeholder="Gəlmə vaxtı" className="h-[48px] px-4 py-2 w-1/2 rounded-r-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none"  />
                </div>
                <div className="flex w-full">
                  <input type="text" placeholder="Haradan" className="h-[48px] px-4 py-2 w-1/2 rounded-l-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none"  />
                  <input type="text" placeholder="Hara" className="h-[48px] px-4 py-2 w-1/2 rounded-r-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none"  />
                </div>
                <input type="text" placeholder="Yükün miqdarı" className="h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#A0A0A0] text-[15px] focus:outline-none"  />
                  {/* Tırın tutumu custom select */}
                  <div className="w-full flex items-center border border-[#CFCFCF] rounded-[8px] overflow-hidden h-[48px]">
                    <div className="w-[228px] flex items-center justify-start h-full text-[#A0A0A0] text-[16px] font-semibold pl-[16px]">Tırın tutumu</div>
                    {/* <div className="w-[1px] h-full bg-[#CFCFCF]" /> */}
                    <button type="button" className="w-[calc(100%-228px)] flex items-center justify-end h-full text-[#2E92A0] text-[16px] font-semibold pr-[16px] gap-2 focus:outline-none border-l border-[#CFCFCF]">
                      Vahid
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                <div className="flex-1 relative">
                  <input type="text" placeholder="Tırın tipi" className="w-full px-4 py-2 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] text-[#2E92A0] text-[15px] font-medium"  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2E92A0] font-medium cursor-pointer select-none">Tırın tipi <span className="ml-1">▼</span></span>
                </div>
                <button type="button" className="w-full mt-2 py-3 rounded-[8px] bg-[#2E92A0] text-white border font-medium text-[18px] hover:bg-[#fff] hover:cursor-pointer hover:text-[#2E92A0] hover:border-[#2E92A0] transition-colors duration-150">Göster</button>
              </form>
            </div>
            {/* Transparent click-outside area */}
            <div className="fixed z-40" onClick={() => setShowFilter(false)} />
          </div>
        )}
          {filteredData.map((item) => (
            <Link
              key={item.id}
              to={`/elanlar/${item.id}`}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[180px] object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">{item.title}</h3>
                <p className="text-[#3F3F3F] text-[15px] mb-2">{item.subtitle}</p>
                <p className="text-[#A0A0A0] text-[13px] mt-auto">{item.date}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Geriye</button>
          <button className="w-8 h-8 rounded bg-[#2E92A0] text-white font-medium">1</button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">2</button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">3</button>
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium">İreli</button>
        </div>
      </div>
    </div>
  );
};
