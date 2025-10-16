import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
const EntreperneurDetailIndex = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://atfplatform.tw1.ru/api/entrepreneur-details/${slug}`);
        setData(res?.data?.data || res.data);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="text-[#3F3F3F]">Məlumat tapılmadı</div>
      </div>
    );
  }

  const adverts = Array.isArray(data.adverts) ? data.adverts : [];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
        >
          <IoArrowBack size={20} />
        </button>

        <div className="bg-white border border-[#E7E7E7] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {data.avatar ? (
                <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#A0A0A0]">No Image</span>
              )}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2 text-[#3F3F3F]">
            <div className="text-2xl font-semibold">{data.name} {data.surname || ''}</div>
            <div className="text-[#6B7280]">{data.email}</div>
            <div className="text-[#6B7280]">{data.phone}</div>
            <div>VÖEN: {data.voen || '-'}</div>
            <div>Vebsayt: {data.website || '-'}</div>
            <div>Açıqlama: {data.description || '-'}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-lg font-medium text-[#3F3F3F] mb-3">Elanlar</div>
          {adverts.length === 0 ? (
            <div className="text-[#6B7280]">Elan yoxdur</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {adverts.map((a) => {
                // photos string may be a JSON string array, try to parse first thumbnail
                let firstPhoto = null;
                if (typeof a.photos === 'string') {
                  try {
                    const parsed = JSON.parse(a.photos);
                    if (Array.isArray(parsed) && parsed.length > 0) firstPhoto = parsed[0];
                  } catch (_) {}
                } else if (Array.isArray(a.photos)) {
                  firstPhoto = a.photos[0];
                }
                return (
                  <Link
                    to={`/dasinma/sahibkar-sexs-elanlari/${a.slug}`}
                    state={{ ownerSlug: data.slug }}
                    key={a.id}
                    className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-[160px] bg-gray-100 flex items-center justify-center">
                      {firstPhoto ? (
                        <img src={firstPhoto} alt={a.name?.az} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#A0A0A0]">No Image</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <div className="font-medium text-[#3F3F3F]">{a.name?.az}</div>
                      <div className="text-[#6B7280] text-sm">{a.load_type?.az}</div>
                      <div className="text-[#6B7280] text-sm">Boş yer: {a.empty_space ?? '-'}</div>
                      <div className="text-[#6B7280] text-sm">Qeydiyyat: {a.truck_registration_number ?? '-'}</div>
                      <div className="text-[#6B7280] text-sm">Çıxış: {a.exit_from_address?.az}</div>
                      <div className="text-[#6B7280] text-sm">Gəlmə: {a.reach_from_address}</div>
                      {a.unit?.type?.az && (
                        <div className="text-[#6B7280] text-sm">Vahid: {a.unit.type.az}</div>
                      )}
                      {a.truck_type?.type?.az && (
                        <div className="text-[#6B7280] text-sm">Tır tipi: {a.truck_type.type.az}</div>
                      )}
                      {a.from && (
                        <div className="text-[#6B7280] text-sm">From: {a.from.country?.az} {a.from.city?.az} {a.from.region?.az}</div>
                      )}
                      {a.to && (
                        <div className="text-[#6B7280] text-sm">To: {a.to.country?.az} {a.to.city?.az} {a.to.region?.az}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntreperneurDetailIndex