import React, { useEffect, useState } from "react";
import { IoArrowBack, IoInformationCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

// API base URL
const API_BASE = 'https://atfplatform.tw1.ru';

export const KataloqDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

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

  const mainImage = (data?.photos && data.photos[selectedImage]) || data?.photos?.[0] || "https://via.placeholder.com/600x400?text=No+Image";
  const title = data?.name?.az || '—';

  return (
    <div className="w-full flex items-center flex-col gap-y-[16px]">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="w-full">
          {/* Back Button */}
          <button
            className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack size={20} />
          </button>
          {/* Gallery */}
          <div className="flex flex-col gap-4 mb-6 max-w-[1000px]">
            <div className="flex flex-col lg:flex-row gap-4">
              {loading ? (
                <div className="w-[288px] h-[260px] bg-gray-200 rounded-[16px] mx-auto animate-pulse" />
              ) : (
                <img
                  src={mainImage}
                  alt="Main"
                  className="w-[288px] h-[260px] object-cover rounded-[16px] mx-auto cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                />
              )}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {(data?.photos?.length ? data.photos : [mainImage]).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    className={`w-[198px] h-[126px] object-cover rounded-[16px] cursor-pointer ${
                      selectedImage === idx ? "border-[#2E92A0]" : "border-[#E7E7E7]"
                    }`}
                    onClick={() => { setSelectedImage(idx); setIsFullscreen(true); }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Fullscreen overlay with zoom/pan */}
          {isFullscreen && (
            <div className="fixed inset-0 z-[1001] bg-black/90 flex items-center justify-center" onMouseUp={() => setIsPanning(false)} onMouseLeave={() => setIsPanning(false)}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0]" onClick={() => setZoom((z) => Math.min(5, z + 0.25))}>+</button>
                <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0]" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>-</button>
                <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0]" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
                <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0]" onClick={() => setIsFullscreen(false)}>Close</button>
              </div>
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
                onWheel={(e) => { e.preventDefault(); const delta = e.deltaY < 0 ? 0.1 : -0.1; setZoom((z) => Math.min(5, Math.max(1, z + delta))); }}
                onMouseDown={(e) => { setIsPanning(true); setLastPos({ x: e.clientX, y: e.clientY }); }}
                onMouseMove={(e) => { if (!isPanning) return; const dx = e.clientX - lastPos.x; const dy = e.clientY - lastPos.y; setPan((p) => ({ x: p.x + dx, y: p.y + dy })); setLastPos({ x: e.clientX, y: e.clientY }); }}
              >
                <img
                  src={mainImage}
                  alt="Fullscreen"
                  style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}
                  className="max-w-none max-h-none object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>
          )}
          {/* Title */}
          <h2 className="text-2xl font-medium pb-4 border-b border-[#E7E7E7]">{title}</h2>
          {/* Stats / Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 pb-6 mt-4 border-b border-[#E7E7E7]">
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
        {/* Right: Contact Card (without car number block) */}
        <div className="w-full md:w-[320px] pt-[56px] relative">
          <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start sticky top-[202px]">
            <div className="font-medium text-[#3F3F3F] mb-2">
              {data?.user ? `${data.user.name || ''} ${data.user.surname || ''}`.trim() : ''}
            </div>
            <span
              onClick={() => {navigate(`/sexsler/huquqi-sexsler/${data?.user?.slug}`)}}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition"
            >
              <IoInformationCircle className="text-[20px]" /> 
              Ətraflı
            </span>
          </div>
        </div>
      </div>
      {error && (
        <div className="max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] text-red-500">{error}</div>
      )}
    </div>
  );
};
