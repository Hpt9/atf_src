import React, { useState, useEffect } from "react";
import AUTH_IMG from "../../assets/images/AUTHIMG.svg";
import { motion, AnimatePresence } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GradientText } from "../../components/shared/GradientText/GradientText";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

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
      <Toaster position="top-right" />
      <div className="w-full max-w-[1920px] flex gap-x-[32px] lg:gap-x-[100px] p-[16px] md:p-[30px] lg:p-[60px]">
        <motion.div
          className="w-[50%] h-full hidden md:flex justify-end "
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -1000 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img src={AUTH_IMG} className="w-full h-full object-contain" alt="" />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="w-full md:w-[50%] flex items-center  relative"
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
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleLogin() {
    setError(false);
    setErrorMessage("");
    
    axios
      .post("https://atfplatform.tw1.ru/api/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          const { token, ...userData } = res.data;
          login(userData, token);
          navigate("/");
        }
      })
      .catch((err) => {
        setError(true);
        if (err.response) {
          setErrorMessage(err.response.data.message || "Email və ya şifrə yanlışdır");
        } else if (err.request) {
          setErrorMessage("Təkrar yoxlayın.");
        } else {
          setErrorMessage("Bir xəta baş verdi. Yenidən yoxlayın.");
        }
      });
  }

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
          <IoIosArrowBack size={24} className="relative right-[2px]" />
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="text-[#3F3F3F]">Hesabınız yoxdur?</span>
          <button
            onClick={() => navigate("/giris?type=register")}
            className="text-[#696969]  px-[16px] py-[8px] rounded-[8px] bg-[white] border border-[#B9B9B9] hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors hover:cursor-pointer"
          >
            Qeydiyyat
          </button>
        </div>
      </div>
      <form className="space-y-4 w-full">
        <div>
          <input
            type="email"
            placeholder="E-mail ünvanı"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifrənizi daxil edin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
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
        {error && (
          <div className="text-[#E94134] text-sm">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-[#2E92A0] text-sm hover:underline cursor-pointer"
          >
            Şifrənizi unutmusunuz?
          </button>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          type="submit"
          className="w-full bg-[#2E92A0] text-white py-4 px-4 rounded-[16px] hover:bg-[#267A85] transition-colors hover:cursor-pointer"
        >
          Daxil ol
        </button>

        <GradientText
          colors={["#4286F5", "#34A853", "#F9BB04", "#E94134"]}
          animationSpeed={20}
          showBorder={true}
          className="custom-class w-full"
        >
          Google ilə davam et
        </GradientText>
      </form>
    </motion.div>
  );
};

const RegisterForm = ({ setLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearForm = () => {
    setFormData({
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(true);
      setErrorMessage("Şifrələr eyni deyil");
      return;
    }

    // Prepare data for API
    const registerData = {
      name: formData.name,
      surname: formData.surname,
      phone: formData.phone.replace(/\D/g, ''), // Remove non-digits
      email: formData.email,
      password: formData.password
    };

    axios
      .post("https://atfplatform.tw1.ru/api/register", registerData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success('Qeydiyyat uğurla tamamlandı!', {
            duration: 2000,
          });
          
          // Clear form immediately
          clearForm();
          
          // Wait for toast duration before redirecting
          setTimeout(() => {
            navigate("/giris?type=login");
          }, 2000);
        }
      })
      .catch((err) => {
        setError(true);
        if (err.response) {
          setErrorMessage(err.response.data.message || "Qeydiyyat zamanı xəta baş verdi");
        } else if (err.request) {
          setErrorMessage("Şəbəkə xətası");
        } else {
          setErrorMessage("Xəta baş verdi");
        }
      });
  };

  return (
    <motion.div
      className="w-full space-y-8 absolute"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-4">
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
            className="text-[#696969] px-[16px] py-[8px] rounded-[8px] bg-[white] border border-[#B9B9B9] hover:bg-[#2E92A0] hover:text-white hover:border-[#2E92A0] transition-colors hover:cursor-pointer"
          >
            Daxil ol
          </button>
        </div>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad"
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
          />
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Soyad"
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
          />
        </div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="994559385489"
          className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
            error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
          }`}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail ünvanı"
          className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
            error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
          }`}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifrə təyin edin"
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifrəni təkrarlayın"
            className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
              error ? 'border-[#E94134]' : 'border-[#E7E7E7] focus:border-[#2E92A0]'
            }`}
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
        {error && (
          <div className="text-[#E94134] text-sm">
            {errorMessage}
          </div>
        )}
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
          className="w-full bg-[#2E92A0] text-white py-4 px-4 rounded-[16px] hover:bg-[#267A85] transition-colors hover:cursor-pointer"
        >
          Qeydiyyatı tamamla
        </button>
        <GradientText
          colors={["#4286F5", "#34A853", "#F9BB04", "#E94134"]}
          animationSpeed={20}
          showBorder={true}
          className="custom-class w-full"
        >
          Google ilə davam et
        </GradientText>
      </form>
    </motion.div>
  );
};
