import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const IndividualIndex = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });
  // Modal removed; using dedicated route for details

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

  // Navigation is now handled via Links to the detail page

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
            <Link
              key={c.slug || idx}
              to={`/sexsler/fiziki-sexsler/${c.slug}`}
              className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden text-left hover:shadow transition"
            >
              <div className="w-full h-[160px] bg-gray-100 flex items-center justify-center">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#A0A0A0]">Şəkil yoxdur</div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="text-[18px] font-medium text-[#3F3F3F]">{c.name} {c.surname || ''}</div>
                <div className="text-[14px] text-[#6B7280]">{c.email}</div>
                <div className="text-[14px] text-[#6B7280]">{c.phone}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Geri</button>
          <span className="text-[#3F3F3F]">{pagination.currentPage} / {pagination.lastPage}</span>
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">İrəli</button>
        </div>

        {/* Detail modal removed */}
      </div>
    </div>
  )
}

export default IndividualIndex