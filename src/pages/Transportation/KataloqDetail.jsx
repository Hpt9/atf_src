import React from "react";
import { IoCall } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const mockCompany = {
  logo: "https://img.icons8.com/ios-filled/100/2E92A0/truck.png",
  name: "Bridge Logistics",
  tırCount: 32,
  emptyTırCount: 14,
  voen: "3252342343434",
  website: "bridge.com",
  email: "bridge@gmail.com",
  phone: "+994(50) 289-34-45",
  date: "05.05.2025 tarixində dərc olunub",
  description:
    "Tır daşımaları üzrə ixtisaslaşmış beynəlxalq logistika şirkəti olaraq, sizə sürətli, etibarlı və vaxtında çatdırılma xidməti təklif edirik. Fransa (Paris), İtaliya (Roma) və Türkiyə (İstanbul) şəhərlərində yerləşən filiallarımız vasitəsilə Avropanın müxtəlif nöqtələrinə optimal daşınma halları təqdim edirik. İllərin təcrübəsi və geniş tərəfdaş şəbəkəmiz yüklərinizin bizimlə tamamilə təhlükəsiz olacağına zəmanət verir.",
  filials: [
    {
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      title: "İtaliya - Roma",
    },
    {
      img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
      title: "Fransa - Paris",
    },
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      title: "Türkiyə - İstanbul",
    },
  ],
};

const mockSimilar = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  logo: mockCompany.logo,
  name: mockCompany.name,
  emptyTırCount: 12,
  phone: mockCompany.phone,
  website: "bridgeturqo.com",
}));

export const KataloqDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center gap-y-[16px]">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="flex-1">
          {/* Back Button */}
          <button
            className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
            onClick={() => navigate(-1)}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#3F3F3F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          {/* Logo */}
          <div className="bg-[#F6F6F6] rounded-[16px] flex items-center px-[16px] md:px-[32px] lg:px-[50px] h-[180px] mb-6">
            <img
              src={mockCompany.logo}
              alt={mockCompany.name}
              className="max-h-[120px] max-w-[320px] object-contain"
            />
          </div>
          {/* Company Name */}
          <h2 className="text-2xl font-medium mb-4">{mockCompany.name}</h2>
          {/* Stats Table */}
          <div className="w-full mb-4">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="py-2 text-[#3F3F3F]">Neçə tırın var</td>
                  <td className="py-2 text-[#2E92A0] font-semibold">
                    {mockCompany.tırCount}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[#3F3F3F]">Boş tırın sayı</td>
                  <td className="py-2 text-[#2E92A0] font-semibold">
                    {mockCompany.emptyTırCount}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[#3F3F3F]">VÖEN</td>
                  <td className="py-2">
                    <a href="#" className="text-[#2E92A0] underline">
                      {mockCompany.voen}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-[#3F3F3F]">Veb sayt</td>
                  <td className="py-2">
                    <a
                      href={`https://${mockCompany.website}`}
                      className="text-[#2E92A0] underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mockCompany.website}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Description */}
          <div className="mb-6 text-[#3F3F3F]">{mockCompany.description}</div>
        </div>
        {/* Right: Contact Card and Filials */}
        <div className="w-full md:w-[320px] flex flex-col gap-4 relative">
          {/* Contact Card */}
          <div className="flex flex-col gap-y-[16px] sticky top-[294px]">
            <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start">
              <div className="font-medium text-[#3F3F3F] mb-2">
                {mockCompany.name}
              </div>
              <div className="text-[#A0A0A0] text-sm mb-2">
                {mockCompany.date}
              </div>
              <a
                href={`mailto:${mockCompany.email}`}
                className="text-[#2E92A0] text-[15px] mb-2 underline"
              >
                {mockCompany.email}
              </a>
              <a
                href={`tel:${mockCompany.phone.replace(/[^0-9+]/g, "")}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition mb-2"
              >
                <IoCall className="text-[20px]" />
                {mockCompany.phone}
              </a>
            </div>
            {/* Filials */}
            <div className="bg-[#F6F6F6] rounded-lg p-4 flex flex-col gap-2">
              <div className="font-medium text-[#3F3F3F] mb-2">Filiallar</div>
              {mockCompany.filials.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg overflow-hidden mb-2"
                >
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-[64px] h-[48px] object-cover rounded"
                  />
                  <div className="text-[#3F3F3F] text-[15px]">{f.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Similar Companies */}
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] flex flex-col gap-y-[16px] mb-[16px] md:mb-[32px]">
        <div className="text-[#3F3F3F] text-[20px] font-medium mb-2">
          Digər şirkətlər
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockSimilar.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-center h-[120px] bg-white border-b border-[#E7E7E7]">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="max-h-[80px] max-w-[160px] object-contain"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">
                  {item.name}
                </h3>
                <p className="text-[#3F3F3F] text-[15px] mb-2">
                  Boş tır sayı: {item.emptyTırCount}
                </p>
                <p className="text-[#A0A0A0] text-[13px] mb-1">{item.phone}</p>
                <a
                  href={`https://${item.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E92A0] text-[13px] underline"
                >
                  {item.website}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
