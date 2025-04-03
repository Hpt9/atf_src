import React, { useState } from "react";
import AUTH_IMG from "../../assets/images/AUTHIMG.svg";
import { motion, AnimatePresence } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const Authentication = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="w-full flex justify-center h-screen">
      <div className="w-full max-w-[2136px] flex gap-x-[100px] p-[60px]">
        <div className="w-[50%] h-full flex justify-end">
          <img src={AUTH_IMG} className="w-full h-full object-contain" alt="" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-[50%] flex items-center  relative">
          <AnimatePresence mode="wait">
            {login ? (
              <LoginForm key="login" setLogin={setLogin}/>
            ) : (
              <RegisterForm key="register" setLogin={setLogin}/>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({setLogin}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <motion.div 
      className="w-full space-y-8 absolute"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold text-[#3F3F3F]">Xoş gəlmisiniz!</h1>
        <p className="text-[#3F3F3F]">Hesabınıza daxil olun</p>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
          >
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>
        <div className="flex justify-end">
          <button type="button" className="text-[#2E92A0] text-sm hover:underline">
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
      </form>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-[#E7E7E7] rounded-lg hover:bg-[#F5F5F5] transition-colors">
          <FcGoogle size={20} />
          <span className="text-[#3F3F3F]">Google ilə davam et</span>
        </button>
      </div>

      <div className="text-center space-x-1">
        <span className="text-[#3F3F3F]">Hesabınız yoxdur?</span>
        <button
          onClick={() => setLogin(false)}
          className="text-[#2E92A0] hover:underline"
        >
          Qeydiyyat
        </button>
      </div>
    </motion.div>
  );
};

const RegisterForm = ({setLogin}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  return (
    <motion.div 
      className="w-full space-y-8 absolute"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLogin(true)}
          className="text-[#3F3F3F] hover:text-[#2E92A0] transition-colors"
        >
          <IoIosArrowBack size={24} />
        </button>
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold text-[#3F3F3F]">Xoş gəlmisiniz!</h1>
          <p className="text-[#3F3F3F]">Hesab yaradın</p>
        </div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        <select className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F] bg-white">
          <option value="">Cinsiniz</option>
          <option value="male">Kişi</option>
          <option value="female">Qadın</option>
        </select>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
          >
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
          >
            {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
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
      </form>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-[#E7E7E7]"></div>
          <span className="text-[#A0A0A0] text-sm">və ya</span>
          <div className="h-[1px] flex-1 bg-[#E7E7E7]"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#E7E7E7] rounded-lg hover:bg-[#F5F5F5] transition-colors">
          <FcGoogle size={20} />
          <span className="text-[#3F3F3F]">Google ilə davam et</span>
        </button>
      </div>

      <div className="text-center space-x-1">
        <span className="text-[#3F3F3F]">Hesabınız var?</span>
        <button
          onClick={() => setLogin(true)}
          className="text-[#2E92A0] hover:underline"
        >
          Daxil ol
        </button>
      </div>
    </motion.div>
  );
};

