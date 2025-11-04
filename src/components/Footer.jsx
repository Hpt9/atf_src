import React from "react";
import KOB_LOGO from "../assets/icons/kob_logo.svg";
import AGTL_LOGO from "../assets/icons/AGTL.svg";
import PASHA_LOGO from "../assets/icons/pasha_logo.svg";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import mttm from "../assets/icons/mttm.svg";
const Footer = () => {
  return (
    <div className="w-full flex justify-center">
      <footer className="bg-[#FAFAFA] text-white py-[16px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] w-full flex justify-center">
      <div className="flex flex-col-reverse md:flex-row gap-y-[32px] md:gap-y-0 justify-between items-center w-full max-w-[1920px]">
        <p className=" text-center text-[rgba(63,63,63,1)]">Bütün hüquqlar qorunur - 2025</p>
        <div className="flex items-center gap-x-[24px] lg:gap-x-[32px] xl:gap-x-[64px]">
          <img src={KOB_LOGO} alt="KOB LOGO" className="w-[40px] h-[55px] lg:w-[55px] lg:h-[70px] hover:cursor-pointer " onClick={() => window.open("https://www.smb.gov.az/az", "_blank")}/>
          <img src={AGTL_LOGO} alt="AGTL LOGO" className="w-[55px] h-[49px] lg:w-[70px] lg:h-[64px] hover:cursor-pointer" onClick={() => window.open("https://agtl.org.az/", "_blank")}/>
          <img
            src={PASHA_LOGO}
            alt="PASHA LOGO"
            className="w-[95px] h-[25px] lg:w-[110px] lg:h-[40px] hover:cursor-pointer"
            onClick={() => window.open("https://pasha-holding.az/", "_blank")}
          />
          <img src={mttm} alt="MTTM LOGO" className="w-[60px] h-[40px] hover:cursor-pointer " onClick={() => window.open("https://mttm.org.az/", "_blank")}/>
        </div>
        <div className="social_medias flex items-center gap-x-[16px]">
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaFacebook className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.facebook.com/azerbaycanticaretforumu/", "_blank")}/>
          </div>

          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaInstagram className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.instagram.com/azerbaycanticaretforumu/", "_blank")}/>
          </div>

        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
