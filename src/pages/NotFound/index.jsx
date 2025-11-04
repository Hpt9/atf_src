import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8 bg-[#FAFAFA] rounded-[24px] p-8 md:p-16 border border-[#E7E7E7]">
          <div className="text-[64px] md:text-[112px] font-bold leading-none text-[#2E92A0]">404</div>
          <div className="text-[20px] md:text-[28px] font-semibold text-[#3F3F3F]">Səhifə tapılmadı</div>
          <p className="text-[#6B7280] text-[14px] md:text-[18px] max-w-[640px]">
            Axtardığınız səhifə mövcud deyil və ya köçürülmüş ola bilər.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="border border-[#2E92A0] text-[#2E92A0] hover:bg-[#E8F5F7] px-5 py-2.5 rounded-lg transition-colors"
            >
              Geri qayıt
            </button>
            <Link
              to="/"
              className="bg-[#2E92A0] text-white hover:bg-[#267A85] px-5 py-2.5 rounded-lg transition-colors"
            >
              Ana səhifəyə keç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;


