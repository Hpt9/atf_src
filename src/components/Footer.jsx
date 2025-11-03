import React from "react";
import KOB_LOGO from "../assets/icons/kob_logo.svg";
import AGTL_LOGO from "../assets/icons/AGTL.svg";
import PASHA_LOGO from "../assets/icons/pasha_logo.svg";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full flex justify-center">
      <footer className="bg-[#FAFAFA] text-white py-[16px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] w-full flex justify-center">
      <div className="flex flex-col-reverse md:flex-row gap-y-[32px] md:gap-y-0 justify-between items-center w-full max-w-[1920px]">
        <p className=" text-center text-[rgba(63,63,63,1)]">Bütün hüquqlar qorunur - 2025</p>
        <div className="flex items-center gap-x-[24px] lg:gap-x-[32px] xl:gap-x-[64px]">
          <img src={KOB_LOGO} alt="KOB LOGO" className="w-[40px] h-[55px] lg:w-[55px] lg:h-[70px] " />
          <img src={AGTL_LOGO} alt="AGTL LOGO" className="w-[55px] h-[49px] lg:w-[70px] lg:h-[64px]" />
          <img
            src={PASHA_LOGO}
            alt="PASHA LOGO"
            className="w-[95px] h-[25px] lg:w-[110px] lg:h-[40px]"
          />
        </div>
        <div className="social_medias flex items-center gap-x-[16px]">
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaFacebook className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.facebook.com/atf.az/", "_blank")}/>
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaLinkedin className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.linkedin.com/company/atf.az/", "_blank")}/>
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaInstagram className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.instagram.com/azerbaycanticaretforumu?igsh=bjR4N241bDN2azRs", "_blank")}/>
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaTwitter className="text-[rgba(63,63,63,1)] w-[20px] h-[20px] hover:cursor-pointer hover:text-[#2E92A0] transition-colors" onClick={() => window.open("https://www.twitter.com/atf.az/", "_blank")}/>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
