import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const IndividualIndex = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchIndividuals = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://atfplatform.tw1.ru/api/individuals?page=${page}`);
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setItems(list);
      if (res?.data?.meta) {
        setPagination({ currentPage: res.data.meta.current_page, lastPage: res.data.meta.last_page });
      }
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (slug) => {
    setSelectedSlug(slug);
    setDetail(null);
    try {
      setDetailLoading(true);
      const res = await axios.get(`https://atfplatform.tw1.ru/api/individual-details/${slug}`);
      setDetail(res?.data?.data || res.data);
    } catch (e) {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedSlug(null);
    setDetail(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) fetchIndividuals(page);
  };

  useEffect(() => { fetchIndividuals(1); }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c, idx) => (
            <button
              key={c.slug || idx}
              onClick={() => openDetail(c.slug)}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden text-left hover:shadow transition"
            >
              <div className="w-full h-[160px] bg-gray-100 flex items-center justify-center">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#A0A0A0]">No Image</div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="text-[18px] font-medium text-[#3F3F3F]">{c.name} {c.surname || ''}</div>
                <div className="text-[14px] text-[#6B7280]">{c.email}</div>
                <div className="text-[14px] text-[#6B7280]">{c.phone}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Geriye</button>
          <span className="text-[#3F3F3F]">{pagination.currentPage} / {pagination.lastPage}</span>
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">İreli</button>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedSlug && (
            <motion.div
              className="fixed inset-0 bg-[#00000066] z-[10000] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl w-full max-w-[720px] p-6 border border-[#E7E7E7] relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button onClick={closeDetail} className="absolute right-4 top-4 text-[#6B7280] hover:text-[#2E92A0]">✕</button>
                {detailLoading ? (
                  <div className="w-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2E92A0]"></div>
                  </div>
                ) : detail ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[80px] h-[80px] rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                        {detail.avatar ? (
                          <img src={detail.avatar} alt={detail.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#A0A0A0] text-sm">No Image</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-[#3F3F3F]">{detail.name} {detail.surname || ''}</div>
                        <div className="text-[#6B7280] text-sm">{detail.email}</div>
                        <div className="text-[#6B7280] text-sm">{detail.phone}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#3F3F3F] text-sm">
                      <div><span className="font-medium">VÖEN:</span> {detail.voen || '-'}</div>
                      <div><span className="font-medium">Vebsayt:</span> {detail.website || '-'}</div>
                      <div className="md:col-span-2"><span className="font-medium">Açıqlama:</span> {detail.description || '-'}</div>
                    </div>
                    {/* Adverts list (if available) */}
                    {Array.isArray(detail.adverts) && detail.adverts.length > 0 && (
                      <div className="mt-2">
                        <div className="text-[#3F3F3F] font-medium mb-2">Elanlar</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {detail.adverts.map((a) => (
                            <div key={a.id} className="border border-[#E7E7E7] rounded-lg p-3">
                              <div className="text-[#3F3F3F] font-medium">{a.name?.az}</div>
                              <div className="text-[#6B7280] text-sm">{a.load_type?.az}</div>
                              <div className="text-[#6B7280] text-sm">{a.reach_from_address}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#3F3F3F]">Məlumat tapılmadı</div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default IndividualIndex