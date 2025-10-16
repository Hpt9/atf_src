import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchBar } from '../../context/SearchBarContext'
import useLanguageStore from '../../store/languageStore'
import { useAuth } from '../../context/AuthContext'

const SahibkarIndex = () => {
  const { setSearchBar } = useSearchBar();
  const { language } = useLanguageStore();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });

  useEffect(() => {
    setSearchBar(
      <div className="relative w-full md:w-[300px] pl-[16px] hidden md:block">
        <input
          type="text"
          placeholder={language === 'az' ? 'Axtar' : language === 'en' ? 'Search' : 'Поиск'}
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute right-7 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
    return () => setSearchBar(null);
  }, [setSearchBar, searchQuery, language]);

  const fetchPage = async (page = 1) => {
    if (!token) {
      navigate('/giris?type=login');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`https://atfplatform.tw1.ru/api/adverts/entrepreneur?page=${page}` ,{
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
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

  useEffect(() => { fetchPage(1); }, [token]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) fetchPage(page);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-403px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E92A0]"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const title = item.name?.[language] || item.name?.az || '-';
            const subtitle = item.load_type?.[language] || item.load_type?.az || '';
            const image = item.photos?.[0];
            const slug = item.slug;
            return (
              <Link
                key={slug || idx}
                to={`/dasinma/sahibkar-sexs-elanlari/${slug}`}
                className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden flex flex-col hover:shadow transition"
              >
                {image ? (
                  <img src={image} alt={title} className="w-full h-[180px] object-cover" />
                ) : (
                  <div className="w-full h-[180px] bg-gray-100" />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-[#3F3F3F] text-[18px] mb-1">{title}</h3>
                  <p className="text-[#3F3F3F] text-[15px] mb-2">{subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">Geriye</button>
          <span className="text-[#3F3F3F]">{pagination.currentPage} / {pagination.lastPage}</span>
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-4 py-2 rounded bg-[#FAFAFA] border border-[#E7E7E7] text-[#3F3F3F] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">İreli</button>
        </div>
      </div>
    </div>
  )
}

export default SahibkarIndex;