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
      <footer className="bg-[#FAFAFA] text-white py-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] w-full max-w-[1920px]">
      <div className="flex justify-between items-center">
        <p className="text-center text-[rgba(63,63,63,1)]">Bütün hüquqlar qorunur - 2025</p>
        <div className="flex items-center lg:gap-x-[32px] xl:gap-x-[64px]">
          <img src={KOB_LOGO} alt="KOB LOGO" className="w-[55px] h-[70px]" />
          <img src={AGTL_LOGO} alt="AGTL LOGO" className="w-[70px] h-[64px]" />
          <img
            src={PASHA_LOGO}
            alt="PASHA LOGO"
            className="w-[110px] h-[40px]"
          />
        </div>
        <div className="social_medias flex items-center gap-x-[16px]">
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaFacebook className="text-[rgba(63,63,63,1)] w-[20px] h-[20px]" />
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaLinkedin className="text-[rgba(63,63,63,1)] w-[20px] h-[20px]" />
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaInstagram className="text-[rgba(63,63,63,1)] w-[20px] h-[20px]" />
          </div>
          <div className="w-[40px] h-[40px] rounded-full border border-[#E7E7E7] flex items-center justify-center">
            <FaTwitter className="text-[rgba(63,63,63,1)] w-[20px] h-[20px]" />
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
