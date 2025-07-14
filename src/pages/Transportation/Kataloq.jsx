import React, { useState } from 'react';

const mockData = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  logo: 'https://img.icons8.com/ios-filled/100/2E92A0/truck.png', // truck icon from icons8
  company: 'Bridge Logistics',
  description: 'Kabin nəqliyyatı və gömrük daxil olmaqla quru yükləşmə xidmətləri göstərir.',
  phone: '+994(50) 289-34-45',
  website: 'bridgexapp.com',
}));

export const Kataloq = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.map((item) => (
            <div key={item.id} className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col">
              <div className="flex items-center justify-center h-[120px] bg-white border-b border-[#E7E7E7]">
                <img
                  src={item.logo}
                  alt={item.company}
                  className="max-h-[80px] max-w-[160px] object-contain"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">{item.company}</h3>
                <p className="text-[#3F3F3F] text-[15px] mb-2">{item.description}</p>
                <p className="text-[#A0A0A0] text-[13px] mt-auto mb-1">{item.phone}</p>
                <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-[#2E92A0] text-[13px] underline">{item.website}</a>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Geri</button>
          <button className="w-8 h-8 rounded bg-[#2E92A0] text-white font-medium">1</button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">2</button>
          <button className="w-8 h-8 rounded bg-white border border-[#E7E7E7] text-[#3F3F3F] font-medium">3</button>
          <button className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium">İrəli</button>
        </div>
      </div>
    </div>
  );
};
