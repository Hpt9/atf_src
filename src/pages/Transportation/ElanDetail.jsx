import React, { useState } from 'react';
import { IoArrowBack, IoCall } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

const mockElan = {
  images: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
  ],
  title: 'Moskva–Bakı',
  contact: {
    name: 'Elman Əfəndiyev',
    date: '05.05.2025 tarixində dərc olunub',
    phone: '+994(50) 289-34-45',
  },
  details: [
    { label: 'Haradan gəlir', value: 'Moskva' },
    { label: 'Hara gedir', value: 'Bakı' },
    { label: 'Na daşıyır', value: 'Her şey' },
    { label: 'Na qədər daşıyır', value: '5 ton' },
    { label: 'Na vaxt çıxır', value: '20 mart 2025 (13:00)' },
    { label: 'Na vaxt çatır (təxmini)', value: '21 mart 2025 (17:00)' },
    { label: 'Ton', value: '22–24' },
    { label: 'Palet', value: '33' },
    { label: 'Ədəd', value: '-' },
    { label: 'Kubmetr (m²)', value: '86–92 m²' },
    { label: 'Konteyner tipi (20ft)', value: '1.5–2 ədəd' },
    { label: 'Konteyner tipi (40ft)', value: '1 ədəd' },
  ],
  description:
    '20 mart 2025 tarixində saat 13:00-da Moskvadan Bakıya yükləşmə reysi həyata keçiriləcək. Marşrut üzrə hər növ yük qəbul olunur. Təxmini çatdırılma vaxtı 21 mart saat 17:00-dir. Hazırda 5 ton boş yer mövcuddur. Yüklər təhlükəsiz şəkildə, vaxtında və məsuliyyətlə çatdırılır. Əlavə məlumat və sifariş üçün əlaqə saxlaya bilərsiniz.',
};

export const ElanDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="flex-1">
          {/* Back Button */}
          <button className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]" onClick={() => navigate(-1)}>
            <IoArrowBack size={20} />
          </button>
          {/* Gallery */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <img
                src={mockElan.images[selectedImage]}
                alt="Main"
                className="w-[288px] h-[260px] object-cover rounded-[16px]"
              />
              <div className="grid grid-cols-4 gap-2">
                {mockElan.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    className={`w-[198px] h-[126px] object-cover rounded-[16px] cursor-pointer ${selectedImage === idx ? 'border-[#2E92A0]' : 'border-[#E7E7E7]'}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Title */}
          <h2 className="text-2xl font-medium pb-4 border-b border-[#E7E7E7]">{mockElan.title}</h2>
          {/* Details Table */}
          <div className="grid grid-cols-4 gap-x-8 gap-y-2 pb-6 mt-4 border-b border-[#E7E7E7]">
            {mockElan.details.map((d, i) => (
              <React.Fragment key={i}>
                <div className="text-[#3F3F3F]">{d.label}</div>
                <div className="text-right text-[#3F3F3F] text-[14px] font-medium">{d.value}</div>
              </React.Fragment>
            ))}
          </div>
          {/* Description */}
          <div className="pt-4 text-[#3F3F3F]">
            {mockElan.description}
          </div>
        </div>
        {/* Right: Contact Card */}
        <div className="w-full md:w-[320px] pt-[56px] relative">
          <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start sticky top-[202px]">
            <div className="font-medium text-[#3F3F3F] mb-2">{mockElan.contact.name}</div>
            <div className="text-[#A0A0A0] text-sm mb-4">{mockElan.contact.date}</div>
            <a
              href={`tel:${mockElan.contact.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition"
            >
              <IoCall className="text-[20px]" />
              {mockElan.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 