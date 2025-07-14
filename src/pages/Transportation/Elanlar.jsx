import React, { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const mockData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Moskva – Bakı',
    subtitle: 'Bütün yüklərin daşınması',
    date: '20 Mart 2025 (13:00) – 21 Mart 2025 (17:00)',
  },
  // Repeat for 12 cards
  // ...
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
          <button className="flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px]">
            <IoFilter className="text-[20px]" />
            Filter
          </button>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.map((item) => (
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
