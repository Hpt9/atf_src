import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack, IoInformationCircle } from 'react-icons/io5';
import { MdNavigateNext } from 'react-icons/md';
import useLanguageStore from '../../store/languageStore';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'https://atfplatform.tw1.ru';

const typeDisplayLabels = {
  az: 'Sahibkar elanları',
  en: 'Entrepreneur adverts',
  ru: 'Объявления предпринимателей'
};

const normalizePhotos = (photos) => {
  if (!photos) return [];
  if (Array.isArray(photos)) return photos;
  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed)) return parsed;
      if (parsed) return [parsed];
    } catch (error) {
      if (photos) return [photos];
    }
  }
  return [];
};

const parseDriverCertificates = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const pickLocalized = (value, language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value?.[language] || value?.az || '';
};

const formatArea = (area, language) => {
  if (!area) return '-';
  const pick = (obj) => obj?.[language] || obj?.az || '';
  const parts = [pick(area.country), pick(area.city), pick(area.region)].filter(Boolean);
  return parts.length ? parts.join(' - ') : '-';
};

const OrderDetail = () => {
  const { language } = useLanguageStore();
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const typeHeader = useMemo(() => typeDisplayLabels[language] || typeDisplayLabels.az, [language]);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const parsePayload = (json) => {
      if (!json) return null;
      if (json?.data?.data) return json.data.data;
      if (json?.data) return json.data;
      return json;
    };

    const buildHeaders = () => {
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        };
      }
      return { Accept: 'application/json' };
    };

    const fetchOwnerDetails = async (ownerSlug) => {
      if (!ownerSlug) return null;
      try {
        const res = await fetch(`${API_BASE}/api/entrepreneur-details/${ownerSlug}`, {
          headers: buildHeaders()
        });
        if (!res.ok) return null;
        const json = await res.json();
        return parsePayload(json);
      } catch (err) {
        console.error('Error fetching owner details', err);
        return null;
      }
    };

    const fetchAdvert = async () => {
      if (!slug) return;
      if (!isActive) return;
      setLoading(true);
      setError(null);
      setData(null);

      const ownerSlugFromState = location.state?.ownerSlug;

      const hydrateWithOwner = async (advert) => {
        if (!advert) return null;
        if (advert.user?.slug) return advert;
        const owner = await fetchOwnerDetails(advert?.user?.slug || advert?.owner_slug);
        if (owner) {
          advert.user = {
            name: owner.name,
            surname: owner.surname,
            slug: owner.slug,
            phone: owner.phone
          };
        }
        return advert;
      };

      try {
        let advert = null;
        if (ownerSlugFromState) {
          const owner = await fetchOwnerDetails(ownerSlugFromState);
          advert = owner?.adverts?.find((a) => a.slug === slug) || null;
          if (advert && owner) {
            advert.user = {
              name: owner.name,
              surname: owner.surname,
              slug: owner.slug,
              phone: owner.phone
            };
          }
        }

        if (!advert) {
          const res = await fetch(`${API_BASE}/api/adverts/entrepreneur/${slug}`, {
            signal: controller.signal,
            headers: buildHeaders()
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          advert = parsePayload(json);
        }

        advert = await hydrateWithOwner(advert);

        if (isActive) {
          if (advert && advert.slug) {
            setData(advert);
          } else {
            setError('Məlumat tapılmadı');
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching entrepreneur advert detail', err);
        if (isActive) setError('Məlumat yüklənmədi');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchAdvert();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [slug, location.state?.ownerSlug, token]);

  const photos = useMemo(() => normalizePhotos(data?.photos), [data]);
  const driverCertificates = useMemo(
    () => parseDriverCertificates(data?.driver_certificates),
    [data]
  );

  const handlePreviousImage = (event) => {
    event.stopPropagation();
    setSelectedImage((prev) =>
      photos.length ? (prev - 1 + photos.length) % photos.length : 0
    );
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    setSelectedImage((prev) => (photos.length ? (prev + 1) % photos.length : 0));
  };

  const handleNavigateUser = () => {
    if (!data?.user?.slug) return;
    navigate(`/sexsler/sahibkarlar/${data.user.slug}`);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="text-[#3F3F3F]">{error || 'Məlumat tapılmadı'}</div>
      </div>
    );
  }

  const mainImage =
    (photos && photos[selectedImage]) ||
    photos?.[0] ||
    'https://via.placeholder.com/600x400?text=No+Image';

  const title = pickLocalized(data?.name, language) || '—';

  const details = [
    {
      label: 'Haradan gəlir',
      value:
        formatArea(data?.from, language) ||
        pickLocalized(data?.exit_from_address, language) ||
        '-'
    },
    {
      label: 'Hara gedir',
      value: formatArea(data?.to, language) || '-'
    },
    {
      label: 'Na daşıyır',
      value: pickLocalized(data?.load_type, language) || '-'
    },
    {
      label: 'Tutum',
      value: data?.capacity != null ? String(data.capacity) : '-'
    },
    {
      label: 'Boş yer',
      value: data?.empty_space != null ? String(data.empty_space) : '-'
    },
    {
      label: 'Çıxış vaxtı',
      value: pickLocalized(data?.exit_from_address, language) || '-'
    },
    {
      label: 'Gəlmə vaxtı',
      value: data?.reach_from_address || '-'
    },
    {
      label: 'Qeydiyyat Nişanı',
      value: data?.truck_registration_number || '-'
    }
  ];

  return (
    <div className="w-full flex items-center flex-col gap-y-[16px]">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <button
            className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack size={20} />
          </button>
          {typeHeader && (
            <div className="text-sm text-[#2E92A0] font-medium mb-2">{typeHeader}</div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {photos.length === 0 ? (
                <div className="w-[288px] h-[260px] bg-gray-200 rounded-[16px] mx-auto" />
              ) : (
                <img
                  src={mainImage}
                  alt="Main"
                  className="w-[288px] h-[260px] object-cover rounded-[16px] mx-auto cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                />
              )}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {photos.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    className={`w-[198px] h-[126px] object-cover rounded-[16px] cursor-pointer ${
                      selectedImage === idx ? 'border-2 border-[#2E92A0]' : 'border border-[#E7E7E7]'
                    }`}
                    onClick={() => {
                      setSelectedImage(idx);
                      setIsFullscreen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {isFullscreen && photos.length > 0 && (
            <div
              className="fixed inset-0 z-[1001] bg-black/90 flex items-center justify-center"
              onMouseUp={() => setIsPanning(false)}
              onMouseLeave={() => setIsPanning(false)}
            >
              <div className="absolute top-4 right-4 flex gap-2 z-[1002]">
                <button
                  className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={() => setZoom((z) => Math.min(5, z + 0.25))}
                >
                  +
                </button>
                <button
                  className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                >
                  -
                </button>
                <button
                  className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                >
                  Sıfırla
                </button>
                <button
                  className="px-3 py-2 rounded bg-white/90 text-[#2E92A0] border border-[#E7E7E7]"
                  onClick={() => setIsFullscreen(false)}
                >
                  Bağla
                </button>
              </div>

              {photos.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-[1002] px-3 py-2 rounded-full bg-[#2E92A0] border border-[#E7E7E7]"
                    onClick={handlePreviousImage}
                  >
                    <MdNavigateNext className="rotate-180 text-white" />
                  </button>
                  <button
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-[1002] px-3 py-2 rounded-full bg-[#2E92A0] border border-[#E7E7E7]"
                    onClick={handleNextImage}
                  >
                    <MdNavigateNext className="text-white" />
                  </button>
                </>
              )}

              <div
                className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY < 0 ? 0.1 : -0.1;
                  setZoom((z) => Math.min(5, Math.max(1, z + delta)));
                }}
                onMouseDown={(e) => {
                  setIsPanning(true);
                  setLastPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  if (!isPanning) return;
                  const dx = e.clientX - lastPos.x;
                  const dy = e.clientY - lastPos.y;
                  setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
                  setLastPos({ x: e.clientX, y: e.clientY });
                }}
              >
                <img
                  src={photos[selectedImage]}
                  alt="Fullscreen"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                  }}
                  className="object-contain select-none max-w-[90vw] max-h-[80vh]"
                  draggable={false}
                />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-medium pb-4 border-b border-[#E7E7E7]">{title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 pb-6 mt-4 border-b border-[#E7E7E7]">
            {details.map((detail, index) => (
              <React.Fragment key={index}>
                <div className="text-[#3F3F3F] whitespace-nowrap">{detail.label}</div>
                <div className="text-right text-[#3F3F3F] text-[14px] font-medium">
                  {detail.value}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="pt-4 text-[#3F3F3F] whitespace-pre-wrap">
            {pickLocalized(data?.description, language) || ''}
          </div>
        </div>

        <div className="w-full md:w-[320px] pt-[56px] relative">
          <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col items-start sticky top-[202px]">
            <div className="font-medium text-[#3F3F3F] mb-2">
              {data?.user ? `${data.user.name || ''} ${data.user.surname || ''}`.trim() : ''}
            </div>
            <span
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px] hover:bg-[#267A85] transition cursor-pointer"
              onClick={handleNavigateUser}
            >
              <IoInformationCircle className="text-[20px]" />
              Ətraflı
            </span>
          </div>

          {(data?.driver_full_name ||
            data?.driver_photo ||
            data?.driver_biography ||
            data?.driver_experience ||
            driverCertificates.length > 0) && (
            <div className="bg-[#F6F6F6] rounded-lg p-6 flex flex-col gap-3 mt-4">
              <div className="text-[#3F3F3F] font-medium text-lg">Sürücü məlumatları</div>
              {data?.driver_photo && (
                <img
                  src={data.driver_photo}
                  alt="Sürücü şəkli"
                  className="w-full h-[180px] object-cover rounded-[12px]"
                />
              )}
              {data?.driver_full_name && (
                <div className="flex items-center justify-between">
                  <span className="text-[#3F3F3F]">Ad Soyad</span>
                  <span className="text-[#3F3F3F] text-[14px] font-medium">
                    {data.driver_full_name}
                  </span>
                </div>
              )}
              {data?.driver_experience && (
                <div className="flex items-center justify-between">
                  <span className="text-[#3F3F3F]">Təcrübə</span>
                  <span className="text-[#3F3F3F] text-[14px] font-medium">
                    {data.driver_experience}
                  </span>
                </div>
              )}
              {data?.driver_biography && (
                <div>
                  <div className="text-[#3F3F3F] mb-1">Bioqrafiya</div>
                  <div className="text-[#3F3F3F] text-[14px] whitespace-pre-line">
                    {data.driver_biography}
                  </div>
                </div>
              )}
              {driverCertificates.length > 0 && (
                <div>
                  <div className="text-[#3F3F3F] mb-2">Sertifikatlar</div>
                  <div className="flex flex-col gap-2">
                    {driverCertificates.map((href, idx) => (
                      <a
                        key={idx}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-3 py-2 rounded-[8px] bg-white text-[#2E92A0] border border-[#E7E7E7] hover:bg-[#F0F9FA] transition text-sm"
                      >
                        Sertifikat {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;