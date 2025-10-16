import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import useLanguageStore from '../../store/languageStore'
import { useAuth } from '../../context/AuthContext'

const SahibkarDetailIndex = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

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
                <img src={images[0]} alt={title} className="w-full h-[260px] object-cover rounded-[12px]" />
              ) : (
                <div className="w-full h-[260px] bg-gray-100 rounded-[12px]" />
              )}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(1, 9).map((img, i) => (
                  <img key={i} src={img} alt={`thumb-${i}`} className="w-full h-[72px] object-cover rounded-[8px]" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-medium text-[#3F3F3F]">{title}</div>
              <div className="text-[#6B7280]">{subtitle}</div>
              <div className="text-[#3F3F3F]">Boş yer: {item.empty_space ?? '-'}</div>
              <div className="text-[#3F3F3F]">Qeydiyyat nömrəsi: {item.truck_registration_number ?? '-'}</div>
              <div className="text-[#3F3F3F]">Çıxış ünvanı: {item.exit_from_address?.[language] || item.exit_from_address?.az || '-'}</div>
              <div className="text-[#3F3F3F]">Gəlmə vaxtı: {item.reach_from_address || '-'}</div>
              <div className="text-[#3F3F3F]">Açıqlama: {item.description?.[language] || item.description?.az || '-'}</div>
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
      </div>
    </div>
  )
}

export default SahibkarDetailIndex;