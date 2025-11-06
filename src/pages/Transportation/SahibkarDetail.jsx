import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import useLanguageStore from '../../store/languageStore'
import { useAuth } from '../../context/AuthContext'
import { MdNavigateNext } from "react-icons/md";
const SahibkarDetailIndex = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // If we came from entrepreneur page, prefer fetching from entrepreneur-details/{ownerSlug}
        const ownerSlug = location.state && location.state.ownerSlug;
        if (ownerSlug) {
          const res = await axios.get(`https://atfplatform.tw1.ru/api/entrepreneur-details/${ownerSlug}`);
          const ownerData = res?.data?.data || {};
          const adverts = ownerData.adverts || [];
          const found = adverts.find(a => a.slug === slug);
          if (found) {
            // Enrich advert with owner info so UI can show Sahib
            found.user = {
              name: ownerData.name,
              surname: ownerData.surname,
              slug: ownerData.slug,
              phone: ownerData.phone,
            };
          }
          setItem(found || null);
          return;
        }
        // Fallback: try direct advert endpoint if backend supports it
        const res = await axios.get(`https://atfplatform.tw1.ru/api/adverts/entrepreneur/${slug}`);
        let advert = res?.data?.data || res?.data;
        // Normalize/override owner from entrepreneur details if slug available for consistency
        const advUserSlug = advert?.user?.slug;
        if (advUserSlug) {
          try {
            const ownerRes = await axios.get(`https://atfplatform.tw1.ru/api/entrepreneur-details/${advUserSlug}`);
            const owner = ownerRes?.data?.data;
            if (owner) {
              advert.user = {
                name: owner.name,
                surname: owner.surname,
                slug: owner.slug,
                phone: owner.phone,
              };
            }
          } catch (_) {
            // ignore, keep advert.user as is
          }
        }
        setItem(advert);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, token, location.state]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="text-[#3F3F3F]">Məlumat tapılmadı</div>
      </div>
    );
  }

  const title = item.name?.[language] || item.name?.az || '-';
  const subtitle = item.load_type?.[language] || item.load_type?.az || '';
  const formatArea = (area, lang) => {
    if (!area) return '-';
    const pick = (obj) => obj?.[lang] || obj?.az || '';
    const parts = [pick(area.country), pick(area.city), pick(area.region)].filter(Boolean);
    return parts.join(' - ') || '-';
  };
  // Normalize photos to an array
  let images = [];
  if (Array.isArray(item.photos)) {
    images = item.photos;
  } else if (typeof item.photos === 'string') {
    try {
      const parsed = JSON.parse(item.photos);
      if (Array.isArray(parsed)) {
        images = parsed;
      } else if (parsed) {
        images = [parsed];
      }
    } catch (_) {
      if (item.photos) images = [item.photos];
    }
  }

  return (
    <div className="w-full flex items-center flex-col gap-y-[16px]">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col gap-6">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack size={20} />
        </button>

        <div className="bg-white border border-[#E7E7E7] rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full min-h-[260px] max-w-[800px] max-h-[450px] object-cover rounded-[12px] cursor-pointer"
                  onClick={() => { setFullscreenIndex(0); setIsFullscreen(true); }}
                />
              ) : (
                <div className="w-full h-[260px] bg-gray-100 rounded-[12px]" />
              )}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(1, 9).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-[72px] object-cover rounded-[8px] cursor-pointer"
                    onClick={() => { setFullscreenIndex(i + 1); setIsFullscreen(true); }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-medium text-[#3F3F3F]">{title}</div>
              <div className="text-[#6B7280]">{subtitle}</div>
              <div className="text-[#3F3F3F]">Gəlmə vaxtı: {item.reach_from_address || '-'}</div>
              <div className="text-[#3F3F3F]">Açıqlama: {item.description?.[language] || item.description?.az || '-'}</div>
              <div className="text-[#3F3F3F]">Daşınacaq yük növü: {item.load_type?.[language] || item.load_type?.az || item.load_type || '-'}</div>
              <div className="text-[#3F3F3F]">Yükün yerləşdiyi ünvan: {formatArea(item.from, language)}</div>
              <div className="text-[#3F3F3F]">Yükün çatdırılacağı ünvanı: {formatArea(item.to, language)}</div>
              <div className="text-[#3F3F3F]">
                Sahib: {item.user ? (
                  <button
                    className="text-[#2E92A0] underline hover:no-underline"
                    onClick={() => navigate(`/sexsler/sahibkarlar/${item.user.slug}`)}
                  >
                    {`${item.user.name} ${item.user.surname}`}
                  </button>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Fullscreen overlay with zoom/pan */}
        {isFullscreen && (
          <div className="fixed inset-0 z-[1001] bg-black/90 flex items-center justify-center" onMouseUp={() => setIsPanning(false)} onMouseLeave={() => setIsPanning(false)}>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]" onClick={() => setZoom((z) => Math.min(5, z + 0.25))}>+</button>
              <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>-</button>
              <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Sıfırla</button>
              <button className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]" onClick={() => setIsFullscreen(false)}>Bağla</button>
            </div>
            {/* Left/Right arrows */}
            {Array.isArray(images) && images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[1002] px-3 py-2 rounded-full bg-[#2E92A0] text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={(e) => { e.stopPropagation(); setFullscreenIndex((i) => (i - 1 + images.length) % images.length); }}
                >
                <MdNavigateNext className="rotate-180 text-white" />
                </button>
                <button
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[1002] px-3 py-2 rounded-full bg-[#2E92A0] text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={(e) => { e.stopPropagation(); setFullscreenIndex((i) => (i + 1) % images.length); }}
                >
                <MdNavigateNext className="text-white" />
                </button>
              </>
            )}
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onWheel={(e) => { e.preventDefault(); const delta = e.deltaY < 0 ? 0.1 : -0.1; setZoom((z) => Math.min(5, Math.max(1, z + delta))); }}
              onMouseDown={(e) => { setIsPanning(true); setLastPos({ x: e.clientX, y: e.clientY }); }}
              onMouseMove={(e) => { if (!isPanning) return; const dx = e.clientX - lastPos.x; const dy = e.clientY - lastPos.y; setPan((p) => ({ x: p.x + dx, y: p.y + dy })); setLastPos({ x: e.clientX, y: e.clientY }); }}
            >
              <img
                src={images[fullscreenIndex] || images[0]}
                alt="Fullscreen"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}
                className="object-contain select-none max-w-[90vw] max-h-[80vh]"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SahibkarDetailIndex;