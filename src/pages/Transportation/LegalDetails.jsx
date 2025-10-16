import React, { useEffect, useState } from "react";
import { IoArrowBack, IoCall } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

// API base URL
const API_BASE = 'https://atfplatform.tw1.ru';

export const KataloqDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/adverts/legal-entities/${slug}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json?.data || null);
      } catch (e) {
        if (e.name !== 'AbortError') setError('Məlumat yüklənmədi');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
    return () => controller.abort();
  }, [slug]);

  const mainImage = data?.photos?.[0] || "https://via.placeholder.com/600x400?text=No+Image";
  const title = data?.name?.az || '—';

  return (
    <div className="w-full flex items-center flex-col gap-y-[16px]">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="flex-1">
          {/* Back Button */}
          <button
            className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack size={20} />
          </button>
          {/* Logo / Main Image */}
          <div className="bg-[#F6F6F6] rounded-[16px] flex items-center justify-center px-[16px] md:px-[32px] lg:px-[50px] h-[180px] mb-6">
            {loading ? (
              <div className="w-[288px] h-[120px] bg-gray-200 rounded" />
            ) : (
              <img
                src={mainImage}
                alt={title}
                className="max-h-[160px] max-w-[320px] object-contain"
              />
            )}
          </div>
          {/* Title */}
          <h2 className="text-2xl font-medium mb-4">{title}</h2>
          {/* Stats / Details */}
          <div className="w-full mb-4">
            <table className="w-full text-left">
              <tbody>
                {[ 
                  { label: "Boş yer", value: data?.empty_space != null ? String(data.empty_space) : '—' },
                  { label: "Tutum", value: data?.capacity != null ? String(data.capacity) : '—' },
                  { label: "Yük tipi", value: data?.load_type?.az || '—' },
                  { label: "Çıxış vaxtı", value: data?.exit_from_address?.az || '—' },
                  { label: "Gəlmə vaxtı", value: data?.reach_from_address || '—' },
                  { label: "Nömrə", value: data?.truck_registration_number || '—' },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-[#3F3F3F]">{row.label}</td>
                    <td className="py-2 text-[#2E92A0] font-semibold">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Description */}
          <div className="mb-6 text-[#3F3F3F]">{data?.description?.az || ''}</div>
        </div>
        {/* Right: Contact Card */}
        <div className="w-full md:w-[320px] flex flex-col gap-4 relative">
          <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start sticky top-[294px]">
            <div className="font-medium text-[#3F3F3F] mb-2">
              {data?.user ? `${data.user.name || ''} ${data.user.surname || ''}`.trim() : ''}
            </div>
            <a
              href={`tel:${(data?.truck_registration_number || '').replace(/[^0-9+]/g, "")}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition mb-2"
            >
              <IoCall className="text-[20px]" />
              Zəng et
            </a>
          </div>
        </div>
      </div>
      {error && (
        <div className="max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] text-red-500">{error}</div>
      )}
    </div>
  );
};
