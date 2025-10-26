import React, { useState, useEffect } from "react";
import { IoArrowBack, IoCall } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

// API base URL; replace if you have an env var
const API_BASE = 'https://atfplatform.tw1.ru';


export const ElanDetail = () => {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [similarAnnouncements, setSimilarAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/adverts/individuals/${slug}`, { signal: controller.signal });
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

  useEffect(() => {
    setLoadingSimilar(true);
    // For now, no mock similar data; simply stop loading after delay
    const timer = setTimeout(() => {
      setSimilarAnnouncements([]);
      setLoadingSimilar(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
          {/* Gallery */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {loading ? (
                <div className="w-[288px] h-[260px] bg-gray-200 rounded-[16px] mx-auto animate-pulse" />
              ) : (
                <img
                  src={(data?.photos && data.photos[selectedImage]) || data?.photos?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                  alt="Main"
                  className="w-[288px] h-[260px] object-cover rounded-[16px] mx-auto"
                />
              )}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {(data?.photos?.length ? data.photos : []).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    className={`w-[198px] h-[126px] object-cover rounded-[16px] cursor-pointer ${
                      selectedImage === idx
                        ? "border-[#2E92A0]"
                        : "border-[#E7E7E7]"
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Title */}
          <h2 className="text-2xl font-medium pb-4 border-b border-[#E7E7E7]">
            {data?.name?.az || '—'}
          </h2>
          {/* Details Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 pb-6 mt-4 border-b border-[#E7E7E7]">
            {/* Map API fields into the details grid */}
            {[
              { label: "Haradan gəlir", value: data?.from?.az || data?.exit_from_address?.az || '—' },
              { label: "Hara gedir", value: data?.to?.az || '—' },
              { label: "Na daşıyır", value: data?.load_type?.az || '—' },
              { label: "Tutum", value: data?.capacity != null ? String(data.capacity) : '—' },
              { label: "Boş yer", value: data?.empty_space != null ? String(data.empty_space) : '—' },
              { label: "Çıxış vaxtı", value: data?.exit_from_address?.az || '—' },
              { label: "Gəlmə vaxtı", value: data?.reach_from_address || '—' },
              { label: "Nömrə", value: data?.truck_registration_number || '—' },
            ].map((d, i) => (
              <React.Fragment key={i}>
                <div className="text-[#3F3F3F] whitespace-nowrap">{d.label}</div>
                <div className="text-right text-[#3F3F3F] text-[14px] font-medium">{d.value}</div>
              </React.Fragment>
            ))}
          </div>
          {/* Description */}
          <div className="pt-4 text-[#3F3F3F]">{data?.description?.az || ''}</div>
        </div>
        {/* Right: Contact Card */}
        <div className="w-full md:w-[320px] pt-[56px] relative">
          <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start sticky top-[202px]">
            <div className="font-medium text-[#3F3F3F] mb-2">
              {data?.user ? `${data.user.name || ''} ${data.user.surname || ''}`.trim() : ''}
            </div>
            <a
              href={`tel:${(data?.user?.phone || '').replace(/[^0-9+]/g, "")}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition"
            >
              <IoCall className="text-[20px]" />
              {data?.user?.phone || 'Zəng et'}
            </a>
          </div>
        </div>
      </div>
      {error && (
        <div className="max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] text-red-500">{error}</div>
      )}
      <div className="similar_announcements w-full flex flex-col gap-y-[16px]  max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] mb-[16px] md:mb-[32px]">
        <div className="similar_announcements_title text-[#3F3F3F] text-[20px] font-medium">
          Digər Elanlar
        </div>
        <div className="similar_announcements_list w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loadingSimilar
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col animate-pulse"
                >
                  <div className="w-full h-[180px] bg-gray-200" />
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            : similarAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="text-lg font-medium text-[#3F3F3F]">{item.title}</div>
                    <div className="text-sm text-[#6B7280]">{item.desc}</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
