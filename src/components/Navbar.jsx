import React from "react";
import { Link } from 'react-router-dom'
export default function Navbar() {
return (
    <header className=" text-white px-[108px] py-[20px] border-t border-[#FAFAFA] bg-white">
      <nav className="container">
        <ul className="flex gap-x-[56px]">
          <li>
            <Link to="/" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              Ana Səhifə
            </Link>
          </li>
          <li>
            <Link to="/hs-codes" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              Hs kodları
            </Link>
          </li>
          <li>
            <Link to="/icazeler" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              İcazələr
            </Link>
          </li>
          <li>
            <Link to="/muracietler" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              Müraciətlər
            </Link>
          </li>
          <li>
            <Link to="/faq" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/elaqe" className="text-[14px] text-[#3F3F3F] font-medium hover:text-[#2E92A0] transition-all duration-150">
              Əlaqə
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
