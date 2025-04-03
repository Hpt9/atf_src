import React, { useState, useEffect } from "react";
import AUTH_IMG from "../../assets/images/AUTHIMG.svg";
import { motion, AnimatePresence } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Authentication = () => {
  const [searchParams] = useSearchParams();
  const [login, setLogin] = useState(true);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "register") {
      setLogin(false);
    } else if (type === "login") {
      setLogin(true);
    }
  }, [searchParams]);

  return (
    <div className="w-full overflow-hidden flex justify-center h-screen">
      <div className="w-full max-w-[1920px] flex gap-x-[32px] lg:gap-x-[100px] p-[16px] md:p-[30px] lg:p-[60px]">
        <motion.div className="w-[50%] h-full hidden md:flex justify-end "
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -1000 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img src={AUTH_IMG} className="w-full h-full object-contain" alt="" />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div className="w-full md:w-[50%] flex items-center  relative"
          initial={{ opacity: 0, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 1000 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {login ? (
              <LoginForm key="login" setLogin={setLogin} />
            ) : (
              <RegisterForm key="register" setLogin={setLogin} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const LoginForm = ({ setLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      className="w-[100%] lg:w-[90%] space-y-8 absolute"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold text-[#3F3F3F]">
          Xoş gəlmisiniz!
        </h1>
        <p className="text-[#3F3F3F]">Hesabınıza daxil olun</p>
      </div>
      <div className="w-full flex justify-between items-center">
        <div 
          onClick={() => navigate("/")}
          className="w-[44px] h-[44px] bg-[#FFF] rounded-full border border-[#B9B9B9] flex items-center justify-center hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors cursor-pointer"
        >
          <IoIosArrowBack size={24} className="relative right-[2px]"/>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="text-[#3F3F3F]">Hesabınız yoxdur?</span>
          <button
            onClick={() => navigate("/giris?type=register")}
            className="text-[#696969]  px-[16px] py-[8px] rounded-[8px] bg-[white] border border-[#B9B9B9] hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors"
          >
            Qeydiyyat
          </button>
        </div>
      </div>
      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="E-mail ünvanı"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifrənizi daxil edin"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] cursor-pointer"
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-[#2E92A0] text-sm hover:underline cursor-pointer"
          >
            Şifrənizi unutmusunuz?
          </button>
        </div>
        <button
          onClick={() => navigate("/")}
          type="submit"
          className="w-full bg-[#2E92A0] text-white py-4 px-4 rounded-lg hover:bg-[#267A85] transition-colors"
        >
          Daxil ol
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-[#E7E7E7] rounded-lg hover:bg-[#F5F5F5] transition-colors">
          <FcGoogle size={20} />
          <span className="text-[#3F3F3F]">Google ilə davam et</span>
        </button>
      </form>
    </motion.div>
  );
};

const RegisterForm = ({ setLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      className="w-full space-y-8 absolute"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-4">
        {/* <button
          onClick={() => setLogin(true)}
          className="text-[#3F3F3F] hover:text-[#2E92A0] transition-colors"
        >
          <IoIosArrowBack size={24} />
        </button> */}
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold text-[#3F3F3F]">
            Xoş gəlmisiniz!
          </h1>
          <p className="text-[#3F3F3F]">Hesab yaradın</p>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div 
          onClick={() => navigate("/")}
          className="w-[44px] h-[44px] bg-[#FFF] rounded-full border border-[#B9B9B9] flex items-center justify-center hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors cursor-pointer"
        >
          <IoIosArrowBack size={24} className="relative right-[2px]" />
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="text-[#3F3F3F]">Hesabınız var?</span>
          <button
            onClick={() => navigate("/giris?type=login")}
            className="text-[#696969] px-[16px] py-[8px] rounded-[8px] bg-[white] border border-[#B9B9B9] hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors"
          >
            Daxil ol
          </button>
        </div>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Ad"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
          <input
            type="text"
            placeholder="Soyad"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
        </div>
        {/* <select className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F] bg-white">
          <option value="">Cinsiniz</option>
          <option value="male">Kişi</option>
          <option value="female">Qadın</option>
        </select> */}
        <input
          type="email"
          placeholder="E-mail ünvanı"
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifrə təyin edin"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] cursor-pointer"
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Şifrəni təkrarlayın"
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] cursor-pointer"
          >
            {showConfirmPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 rounded border-[#E7E7E7] text-[#2E92A0] focus:ring-[#2E92A0]"
          />
          <label htmlFor="terms" className="text-[#3F3F3F] text-sm">
            İstifadəçi şərtlərini oxudum və razıyam
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-[#2E92A0] text-white py-2 px-4 rounded-lg hover:bg-[#267A85] transition-colors"
        >
          Qeydiyyatı tamamla
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#E7E7E7] rounded-lg hover:bg-[#F5F5F5] transition-colors">
          <FcGoogle size={20} />
          <span className="text-[#3F3F3F]">Google ilə davam et</span>
        </button>
      </form>

    </motion.div>
  );
};
