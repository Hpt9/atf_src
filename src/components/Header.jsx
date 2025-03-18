import Navbar from "./Navbar";
import ATF_LOGO from "../assets/icons/atf_logo.svg"

const Header = () => {
  return (
    <div className="w-full flex flex-col sticky top-0 z-50">
      <div className="login w-full h-[118px] bg-white flex justify-between items-center px-[108px] py-[20px]">
        <img src={ATF_LOGO} alt="ATF LOGO" className="w-[94px] h-[78px]"/>
        <div className="flex gap-4">
          <select className="bg-transparent border-none outline-none cursor-pointer">
            <option value="az">AZ</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
          <button className="px-4 py-[10px] font-semibold text-[#2E92A0]  hover:text-[white] rounded-[8px] bg-white hover:bg-[#2E92A0] transition-colors border border-[#2E92A0]">
            Qeydiyyat
          </button>
          <button className="px-6 py-[10px] bg-[#2E92A0] text-white rounded-[8px] hover:bg-[white] hover:text-[#2E92A0] transition-colors  border border-[#2E92A0]">
            Daxil ol
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
