import React, { useState, useEffect, useMemo } from 'react';
import { IoFilter, IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchBar } from '../../context/SearchBarContext';
import useLanguageStore from '../../store/languageStore';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'https://atfplatform.tw1.ru';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400?text=No+Image';

const filterLegalStatusOptions = [
  { value: '', label: { az: 'Status seçin', en: 'Select status', ru: 'Выберите статус' } },
  { value: 'individual', label: { az: 'Fiziki şəxs', en: 'Individual', ru: 'Физическое лицо' } },
  { value: 'legal', label: { az: 'Hüquqi şəxs', en: 'Legal entity', ru: 'Юридическое лицо' } }
];

const getLocalizedLabel = (option, language) => option.label[language] || option.label.az;

const buildLocationLabel = (area, language) => {
  if (!area) return '';
  const pick = (obj) => obj?.[language] || obj?.az || '';
  const parts = [pick(area.country), pick(area.city), pick(area.region)].filter(Boolean);
  return parts.join(', ');
};

const AllAdverts = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const { token } = useAuth();

  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [noResultsMsg, setNoResultsMsg] = useState('');
  const [listsLoading, setListsLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [units, setUnits] = useState([]);
  const [truckTypes, setTruckTypes] = useState([]);

  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [truckTypeId, setTruckTypeId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [legalStatusFilter, setLegalStatusFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    setSearchBar(null);
    return () => setSearchBar(null);
  }, [setSearchBar]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setListsLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : { Accept: 'application/json' };
        const [areasRes, unitsRes, trucksRes] = await Promise.all([
          fetch(`${API_BASE}/api/areas`, { headers }),
          fetch(`${API_BASE}/api/units`, { headers }),
          fetch(`${API_BASE}/api/truck-types`, { headers })
        ]);
        const [areasJson, unitsJson, trucksJson] = await Promise.all([
          areasRes.ok ? areasRes.json() : Promise.resolve({ data: [] }),
          unitsRes.ok ? unitsRes.json() : Promise.resolve({ data: [] }),
          trucksRes.ok ? trucksRes.json() : Promise.resolve({ data: [] })
        ]);
        setAreas(Array.isArray(areasJson?.data) ? areasJson.data : []);
        setUnits(Array.isArray(unitsJson?.data) ? unitsJson.data : []);
        setTruckTypes(Array.isArray(trucksJson?.data) ? trucksJson.data : []);
      } catch (listError) {
        console.error('Error fetching filter lists', listError);
      } finally {
        setListsLoading(false);
      }
    };
    fetchLists();
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          headers.Accept = 'application/json';
        }

        const body = { ...appliedFilters };
        const query = page > 1 ? `?page=${page}` : '';

        const res = await fetch(`${API_BASE}/api/adverts/all${query}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal
        });

        if (!res.ok) {
          if (res.status === 404) {
            setItems([]);
            setMeta(null);
            setNoResultsMsg('');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];

        setItems(list);
        setMeta(json?.meta || null);
        setNoResultsMsg(list.length ? '' : 'Filterə uyğun nəticə tapılmadı');
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error('Error fetching adverts', fetchError);
          setError('Verilər yüklənərkən xəta baş verdi');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [appliedFilters, page, token]);

  const getTypeBadgeLabel = (item) => {
    const legalStatus = item?.user?.legal_status;
    const type = item?.type;
    if (legalStatus === 'individual') {
      return language === 'en' ? 'Individual' : language === 'ru' ? 'Физiki şəxs' : 'Fiziki şəxs';
    }
    if (legalStatus === 'legal') {
      return language === 'en' ? 'Legal entity' : language === 'ru' ? 'Юридическое лицо' : 'Hüquqi şəxs';
    }
    if (type === 'entrepreneur') {
      return language === 'en' ? 'Entrepreneur' : language === 'ru' ? 'Предприниматель' : 'Sahibkar';
    }
    if (type === 'transporter') {
      return language === 'en' ? 'Transporter' : language === 'ru' ? 'Перевозчик' : 'Daşıyıcı';
    }
    return '';
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (fromId) filters.from_id = Number(fromId);
    if (toId) filters.to_id = Number(toId);
    if (unitId) filters.unit_id = Number(unitId);
    if (truckTypeId) filters.truck_type_id = Number(truckTypeId);
    if (capacity) filters.capacity = Number(capacity);
    if (legalStatusFilter) {
      filters.legal_status = legalStatusFilter;
    }

    setAppliedFilters(filters);
    setPage(1);
    setShowFilter(false);
  };

  const handleLegalStatusChange = (value) => {
    setLegalStatusFilter(value);
  };

  const resetFilters = () => {
    setFromId('');
    setToId('');
    setUnitId('');
    setTruckTypeId('');
    setCapacity('');
    setLegalStatusFilter('');
    setAppliedFilters({});
    setPage(1);
  };

  const renderCard = (item) => {
    const image = item?.photos?.[0] || PLACEHOLDER_IMAGE;
    const title = item?.name?.[language] || item?.name?.az || '—';
    const subtitle = item?.load_type?.[language] || item?.load_type?.az || '';
    const date = item?.reach_from_address || '';
    const typeLabel = getTypeBadgeLabel(item);
    const fromLabel = buildLocationLabel(item?.from, language);
    const toLabel = buildLocationLabel(item?.to, language);

    return (
      <Link
        key={`${item.slug}-${item.type}`}
        to={`/dasinma/elanlar/${item.type || 'individual'}/${item.slug}`}
        state={{ advertType: item.type }}
        className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition h-fit"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-[180px] object-cover"
        />
        <div className="p-4 flex flex-col flex-1 gap-2">
          {typeLabel ? (
            <span className="self-start px-3 py-1 text-xs font-semibold rounded-full bg-[#F0F9FA] text-[#2E92A0] border border-[#BFE2E6]">
              {typeLabel}
            </span>
          ) : null}
          <h3 className="font-medium text-[#3F3F3F] text-[18px]">{title}</h3>
          {subtitle && <p className="text-[#3F3F3F] text-[15px]">{subtitle}</p>}
          {(fromLabel || toLabel) && (
            <p className="text-[#6B7280] text-[13px]">
              {fromLabel && <span>{fromLabel}</span>}
              {fromLabel && toLabel && <span> &rarr; </span>}
              {toLabel && <span>{toLabel}</span>}
            </p>
          )}
          {date && <p className="text-[#A0A0A0] text-[13px] mt-auto">{date}</p>}
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8 min-h-[calc(100vh-203px)]">
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4 mb-6">
          <button
            className="flex-shrink-0 hidden md:flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px]"
            onClick={() => setShowFilter(true)}
          >
            <IoFilter className="text-[20px]" />
            Filtr
          </button>
          <div className="flex w-full md:w-auto gap-2 md:order-2 order-1 md:hidden">
            <button
              className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#2E92A0] text-white font-medium text-[16px]"
              onClick={() => setShowFilter(true)}
            >
              <IoFilter className="text-[20px]" />
              Filtr
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative overflow-x-hidden min-h-[calc(100vh-203px)]">
          <AnimatePresence>
            {showFilter && (
              <motion.div
                className="absolute right-0 w-full md:w-[404px] bg-white shadow-xl z-[1000] flex flex-col p-[16px] md:p-[32px] rounded-[8px] filter-modal"
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <button
                      className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#FAFAFA] border border-[#E7E7E7] hover:bg-[#F0F0F0]"
                      onClick={() => setShowFilter(false)}
                    >
                      <IoClose size={24} />
                    </button>
                    <button
                      className="text-sm text-[#2E92A0] underline"
                      onClick={resetFilters}
                      type="button"
                    >
                      Sıfırla
                    </button>
                  </div>
                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col w-full gap-4">
                      <select
                        value={fromId}
                        onChange={(e) => setFromId(e.target.value)}
                        disabled={listsLoading}
                        className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]"
                      >
                        <option value="">Haradan</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {buildLocationLabel(area, language) || area.id}
                          </option>
                        ))}
                      </select>
                      <select
                        value={toId}
                        onChange={(e) => setToId(e.target.value)}
                        disabled={listsLoading}
                        className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]"
                      >
                        <option value="">Hara</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {buildLocationLabel(area, language) || area.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="flex items-center border border-[#E7E7E7] rounded-lg overflow-hidden h-[48px] bg-white">
                        <input
                          type="number"
                          placeholder="Tutum"
                          value={capacity}
                          min={0}
                          onKeyDown={(e) => {
                            if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setCapacity('');
                              return;
                            }
                            const numeric = Math.max(0, Number(value));
                            setCapacity(Number.isNaN(numeric) ? '' : String(numeric));
                          }}
                          className="flex-1 h-full px-4 py-2 text-[#3F3F3F] text-[15px] focus:outline-none border-none"
                        />
                        <div className="w-px h-6 bg-[#E7E7E7]" />
                        <select
                          disabled={listsLoading}
                          value={unitId}
                          onChange={(e) => setUnitId(e.target.value)}
                          className="flex-1 h-full px-4 py-2 text-[#3F3F3F] text-[15px] focus:outline-none border-none bg-transparent"
                        >
                          <option value="">Vahid</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.type?.[language] || unit.type?.az || unit.id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="w-full">
                      <select
                        value={truckTypeId}
                        onChange={(e) => setTruckTypeId(e.target.value)}
                        disabled={listsLoading}
                        className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]"
                      >
                        <option value="">Tırın tipi</option>
                        {truckTypes.map((truck) => (
                          <option key={truck.id} value={truck.id}>
                            {truck.type?.[language] || truck.type?.az || truck.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <select
                        value={legalStatusFilter}
                        onChange={(e) => handleLegalStatusChange(e.target.value)}
                        className="w-full h-[48px] px-4 py-2 rounded-lg border border-[#E7E7E7] bg-white text-[#3F3F3F] text-[15px] focus:outline-none focus:border-[#2E92A0]"
                      >
                        {filterLegalStatusOptions.map((option) => (
                          <option key={option.value || 'default'} value={option.value}>
                            {getLocalizedLabel(option, language)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="w-full mt-2 py-3 rounded-[8px] bg-[#2E92A0] text-white border font-medium text-[18px] hover:bg-[#fff] hover:text-[#2E92A0] hover:border-[#2E92A0] transition-colors duration-150"
                      onClick={handleApplyFilters}
                    >
                      Göstər
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading &&
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col animate-pulse"
              >
                <div className="w-full h-[180px] bg-gray-200" />
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}

          {!loading && items.map(renderCard)}

          {!loading && !items.length && !error && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-[#FAFAFA] border border-[#E7E7E7] rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 text-[#A0A0A0] mb-3"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="text-[#3F3F3F] text-[16px] font-medium mb-1">
                {noResultsMsg || 'Nəticə tapılmadı'}
              </div>
              <div className="text-[#6B7280] text-[14px]">
                Sorğunuzu dəyişdirin və ya daha sonra yenidən yoxlayın.
              </div>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center text-red-500">{error}</div>
          )}
        </div>

        {!loading && items.length > 0 && (meta?.last_page || 1) > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={!meta || page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Geriye
            </button>
            {(meta?.links || [])
              .filter((link) => link.label && !/\D/.test(link.label.replace('&hellip;', '').trim()) && link.url)
              .map((link, idx) => {
                const url = link.url || '';
                const match = url.match(/page=(\d+)/);
                const pageNum = match ? Number(match[1]) : Number(link.label);
                const normalizedLabel = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                return (
                  <button
                    key={`${normalizedLabel}-${idx}`}
                    className={`w-8 h-8 rounded font-medium ${
                      link.active
                        ? 'bg-[#2E92A0] text-white'
                        : 'bg-white border border-[#E7E7E7] text-[#3F3F3F]'
                    }`}
                    onClick={() => !link.active && pageNum && setPage(pageNum)}
                  >
                    {normalizedLabel}
                  </button>
                );
              })}
            <button
              className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={!meta || page >= (meta?.last_page || 1)}
              onClick={() =>
                setPage((prev) => (meta ? Math.min(meta.last_page || prev + 1, prev + 1) : prev + 1))
              }
            >
              İreli
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAdverts;

