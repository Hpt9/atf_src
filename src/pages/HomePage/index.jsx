import React, { useEffect, useState } from "react";
import IMG from "../../assets/images/homepage_img.svg";
import { CiSearch } from "react-icons/ci";
import { FaRegFileAlt } from "react-icons/fa";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { PiDotsSixBold } from "react-icons/pi";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLanguageStore from "../../store/languageStore";

const HomePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [data, setData] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [homeRes, servicesRes] = await Promise.all([
          axios.get("https://atfplatform.tw1.ru/api/home"),
          axios.get("https://atfplatform.tw1.ru/api/services")
        ]);

        if (homeRes.data) {
          setData(homeRes.data);
        }
        if (servicesRes.data) {
          setServices(servicesRes.data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get icon component based on service type
  const getIconComponent = (serviceName) => {
    switch (serviceName.toLowerCase()) {
      case 'qeydiyyat':
        return <PiDotsSixBold className="w-[24px] h-[24px] group-hover:text-[#2E92A0] transition-all duration-200" />;
      case 'hs koda görə axtarış':
        return <HiOutlineCreditCard className="w-[24px] h-[24px] group-hover:text-[#2E92A0] transition-all duration-200" />;
      default:
        return <FaRegFileAlt className="w-[24px] h-[24px] group-hover:text-[#2E92A0] transition-all duration-200" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="">
      <div
        className="w-full h-[220px] md:h-[457px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${IMG})` }}
      >
        <div className="title w-full h-full flex flex-col justify-center items-center relative">
          <div className="cover w-[100%] h-[100%] bg-[rgba(5,32,75,0.72)] absolute top-0 left-0"></div>
          <div className="text_container w-[100%] max-w-[2136px] h-[100%] flex flex-col relative z-10 px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] pt-[64px] md:pt-[80px]">
            <h1 className="text-[white] text-[24px] md:text-[48px] font-bold w-fit md:w-[698px] mb-[30px]">
              {data?.slider_title?.[language] || "Loading..."}
            </h1>
            <div className="search_container w-[496px] hidden md:flex items-center gap-x-[8px] relative z-10 rounded-[8px] bg-white px-[16px] py-[12px]">
              <CiSearch className="text-[rgba(160,160,160,1)] w-[16px] h-[16px]" />
              <input
                type="text"
                placeholder="Axtarış..."
                className="w-full outline-none text-[#2E92A0] placeholder:text-[rgba(160,160,160,1)] placeholder:text-[16px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full flex justify-center">
        <div className="services w-full max-w-[2136px] flex flex-col px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-[50px] gap-y-[27px]">
          <h1 className="text-[#3F3F3F] text-[16px] md:text-[24px] font-bold">
            {data?.services_title?.[language] || "Loading..."}
          </h1>
          <div className="services_container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.slice().reverse().map((service) => (
              <div
                key={service.id}
                className="service_card group rounded-[16px] p-6 cursor-pointer transition-all duration-300 bg-[#FAFAFA]"
                onClick={() => navigate(service.slug)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="icon w-[40px] h-[40px] rounded-full border border-[#E7E7E7] bg-[#F5F5F5] flex items-center justify-center group-hover:border-[#2E92A0] transition-all duration-200">
                    {getIconComponent(service.title[language] || service.title.az)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-[#3F3F3F] text-[14px] md:text-[20px] font-medium group-hover:text-[#2E92A0] transition-all duration-200">
                    {service.title[language] || service.title.az}
                  </h3>
                  <FaArrowRight className="text-[#3F3F3F] w-6 h-6 group-hover:text-[#2E92A0] group-hover:rotate-[-45deg] transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
