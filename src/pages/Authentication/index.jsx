import React, { useState, useEffect } from "react";
import AUTH_IMG from "../../assets/images/AUTHIMG.svg";
import { motion, AnimatePresence } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GradientText } from "../../components/shared/GradientText/GradientText";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export const Authentication = () => {
  const [searchParams] = useSearchParams();
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      // User is already logged in, redirect to home page
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "register") {
      setLogin(false);
    } else if (type === "login") {
      setLogin(true);
    }
  }, [searchParams]);

  // If token exists, don't render the authentication page
  if (token) {
    return null;
  }

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
              <LoginForm key="login" />
            ) : (
              <RegisterForm key="register" />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);

    axios
      .post("https://atfplatform.tw1.ru/api/auth/google", {
        name: decoded.given_name,
        email: decoded.email,
        surname: decoded.family_name,
        google_id: decoded.sub,
      })
      .then((res) => {
        handleAuthSuccess(res.data);
      })
      .catch((err) => {
        // If we have user data in the error response, treat it as success
        if (
          err.response &&
          err.response.data &&
          err.response.data.token &&
          err.response.data.user
        ) {
          handleAuthSuccess(err.response.data);
        } else {
          toast.error("Xəta baş verdi");
        }
      });
  };

  const handleGoogleError = () => {
    console.log("Google Sign-In Failed");
    toast.error("Google ilə daxil olmaq alınmadı");
  };

  // Helper function to handle successful auth (both from success and error paths)
  const handleAuthSuccess = (data) => {
    // Log in the user with the received data
    login(data.token).then((userData) => {
      // Show the phone number missing message if no phone
      if (userData && !userData.phone) {
        toast.error("Telefon nömrəniz qeyd olunmayıb", {
          duration: 3000,
        });
      }

      // Navigate to home
      setTimeout(() => {
        navigate("/");
      }, 1000);
    });
  };

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
          const { token } = res.data;
          login(token).then(() => {
            navigate("/");
          });
        }
      })
      .catch((err) => {
        setError(true);
        if (err.response) {
          setErrorMessage(
            err.response.data.message || "Email və ya şifrə yanlışdır"
          );
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
              error
                ? "border-[#E94134]"
                : "border-[#E7E7E7] focus:border-[#2E92A0]"
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
              error
                ? "border-[#E94134]"
                : "border-[#E7E7E7] focus:border-[#2E92A0]"
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
        {error && <div className="text-[#E94134] text-sm">{errorMessage}</div>}
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

        {/* <GradientText
          colors={["#4286F5", "#34A853", "#F9BB04", "#E94134"]}
          animationSpeed={20}
          showBorder={true}
          className="custom-class w-full"
          onClick={() => {console.log("clicked")}}
        >
          Google ilə davam et
        </GradientText> */}
      </form>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_black"
          shape="pill"
          size="large"
          text="continue_with"
          locale="az"
        />
      </div>
    </motion.div>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [userType, setUserType] = useState(''); // 'individual' | 'entrepreneur' | 'company'
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    website: "",
    voen: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms: "",
  });

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");

    // Return empty if no input
    if (number.length === 0) return "";

    // Start building the formatted number
    let formatted = "+";

    // Add the country code
    if (number.length >= 3) {
      formatted += number.slice(0, 3);
      if (number.length > 3) formatted += "-";
    } else {
      return formatted + number;
    }

    // Add the operator code
    if (number.length >= 5) {
      formatted += number.slice(3, 5);
      if (number.length > 5) formatted += "-";
    } else {
      return formatted + number.slice(3);
    }

    // Add the first part of subscriber number
    if (number.length >= 8) {
      formatted += number.slice(5, 8);
      if (number.length > 8) formatted += "-";
    } else {
      return formatted + number.slice(5);
    }

    // Add the second part
    if (number.length >= 10) {
      formatted += number.slice(8, 10);
      if (number.length > 10) formatted += "-";
    } else {
      return formatted + number.slice(8);
    }

    // Add the last part
    if (number.length >= 12) {
      formatted += number.slice(10, 12);
    } else {
      return formatted + number.slice(10);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number formatting
    if (name === "phone") {
      const formattedNumber = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedNumber,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time password match validation
    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: "Şifrələr eyni deyil",
            confirmPassword: "Şifrələr eyni deyil",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
          }));
        }
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validate terms acceptance
    if (!acceptedTerms) {
      setErrors((prev) => ({
        ...prev,
        terms:
          "Qeydiyyatdan keçmək üçün istifadəçi şərtlərini qəbul etməlisiniz",
      }));
      return;
    }

    // Only validate password match in frontend
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        password: "Şifrələr eyni deyil",
        confirmPassword: "Şifrələr eyni deyil",
      });
      return;
    }

    // Clear any existing errors before submission
    setErrors({});

    // Prepare data for API - strip formatting from phone number
    const registerData = {
      name: formData.name,
      surname: formData.surname || null,
      phone: formData.phone.replace(/\D/g, ""),
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      website: formData.website || null,
      voen: formData.voen || null,
    };

    let endpoint = 'https://atfplatform.tw1.ru/api/register-individual';
    if (userType === 'entrepreneur') endpoint = 'https://atfplatform.tw1.ru/api/register-entrepreneur';
    if (userType === 'company') endpoint = 'https://atfplatform.tw1.ru/api/register-company';

    setIsLoading(true);

    axios
      .post(endpoint, registerData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const { token } = res.data;

          // Show success toast
          toast.success("Qeydiyyat uğurla tamamlandı!", {
            duration: 2000,
          });

          // Show email verification toast
          toast.error("Zəhmət olmasa e-poçt ünvanınızı təsdiq edin", {
            duration: 5000,
            position: "top-right",
            id: "email-verification-reminder",
          });

          // Log in the user immediately
          login(token);

          // Navigate to home page after toast
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          // Handle only backend-specific validation errors (email and phone)
          const backendErrors = err.response.data;
          const newErrors = {};

          if (backendErrors.phone) {
            newErrors.phone = "Belə bir telefon artıq mövcuddur.";
          }
          if (backendErrors.email) {
            newErrors.email = "Belə bir e-poçt ünvanı artıq mövcuddur.";
          }

          setErrors(newErrors);
        } else if (err.request) {
          toast.error("Şəbəkə xətası");
        } else {
          toast.error("Xəta baş verdi");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);

    axios
      .post("https://atfplatform.tw1.ru/api/auth/google", {
        name: decoded.given_name,
        email: decoded.email,
        surname: decoded.family_name,
        google_id: decoded.sub,
      })
      .then((res) => {
        handleAuthSuccess(res.data);
      })
      .catch((err) => {
        // If we have user data in the error response, treat it as success
        if (
          err.response &&
          err.response.data &&
          err.response.data.token &&
          err.response.data.user
        ) {
          handleAuthSuccess(err.response.data);
        } else {
          toast.error("Xəta baş verdi");
        }
      });
  };

  const handleGoogleError = () => {
    console.log("Google Sign-In Failed");
    toast.error("Google ilə daxil olmaq alınmadı");
  };

  // Helper function to handle successful auth (both from success and error paths)
  const handleAuthSuccess = (data) => {
    // Log in the user with the received data
    login(data.token).then((userData) => {
      // Show the phone number missing message if no phone
      if (userData && !userData.phone) {
        toast.error("Telefon nömrəniz qeyd olunmayıb", {
          duration: 3000,
        });
      }

      // Navigate to home
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
        {/* User Type Selection */}
        {/* Desktop/Tablet: button group */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setUserType('individual')}
            className={`px-4 py-3 rounded-lg border ${userType === 'individual' ? 'border-[#2E92A0] text-[#2E92A0] bg-[#F0FCFD]' : 'border-[#E7E7E7] text-[#3F3F3F] bg-white'}`}
          >
            Fiziki şəxs
          </button>
          <button
            type="button"
            onClick={() => setUserType('entrepreneur')}
            className={`px-4 py-3 rounded-lg border ${userType === 'entrepreneur' ? 'border-[#2E92A0] text-[#2E92A0] bg-[#F0FCFD]' : 'border-[#E7E7E7] text-[#3F3F3F] bg-white'}`}
          >
            Sahibkar
          </button>
          <button
            type="button"
            onClick={() => setUserType('company')}
            className={`px-4 py-3 rounded-lg border ${userType === 'company' ? 'border-[#2E92A0] text-[#2E92A0] bg-[#F0FCFD]' : 'border-[#E7E7E7] text-[#3F3F3F] bg-white'}`}
          >
            Hüquqi şəxs (Şirkət)
          </button>
        </div>
        {/* Mobile: Select dropdown */}
        <div className="md:hidden">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full px-4 py-3 border border-[#E7E7E7] rounded-lg text-[#3F3F3F] focus:outline-none focus:border-[#2E92A0] bg-white"
          >
            <option value="" disabled>Qeydiyyat tipini seçin</option>
            <option value="individual">Fiziki şəxs</option>
            <option value="entrepreneur">Sahibkar</option>
            <option value="company">Hüquqi şəxs (Şirkət)</option>
          </select>
        </div>

        {/* Block form until user type is selected */}
        {!userType && (
          <div className="text-[#6B7280] text-sm">Zəhmət olmasa, qeydiyyat tipini seçin.</div>
        )}

        {userType && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 2xl:grid-cols-2">
          <input
            type="text"
            autoComplete="on"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad"
            className="w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] border-[#E7E7E7] focus:border-[#2E92A0]"
          />
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Soyad"
            className="w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] border-[#E7E7E7] focus:border-[#2E92A0]"
          />
        </div>
        )}
        {userType && (
        <div className="grid grid-cols-2 md:grid-cols-2  gap-4 2xl:grid-cols-2">
          <div className="space-y-1">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+994-99-999-99-99"
              className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
                errors.phone
                  ? "border-[#E94134]"
                  : "border-[#E7E7E7] focus:border-[#2E92A0]"
              }`}
            />
            {errors.phone && (
              <div className="text-[#E94134] text-sm">{errors.phone}</div>
            )}
          </div>
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail ünvanı"
              className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
                errors.email
                  ? "border-[#E94134]"
                  : "border-[#E7E7E7] focus:border-[#2E92A0]"
              }`}
            />
            {errors.email && (
              <div className="text-[#E94134] text-sm">{errors.email}</div>
            )}
          </div>
        </div>
        )}
        {userType && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 2xl:grid-cols-2">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Vebsayt (opsional)"
              className="w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] border-[#E7E7E7] focus:border-[#2E92A0]"
            />
<input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              min={100000000}
              max={999999999}
              title="VÖEN 9 rəqəmdən ibarət olmalıdır"
              required
              name="voen"
              value={formData.voen}
              onChange={(e) => {
                const sanitized = String(e.target.value || '')
                  .replace(/\D/g, '')
                  .slice(0, 9);
                e.target.value = sanitized;
                handleChange(e);
              }}
              onKeyDown={(e) => {
                // Prevent non-numeric entries like e, E, +, -, .
                if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                // Enforce max length 9 in case of paste or scroll changes
                const sanitized = String(e.target.value || '').replace(/\D/g, '').slice(0, 9);
                if (sanitized !== e.target.value) {
                  e.target.value = sanitized;
                }
              }}
              placeholder="VÖEN"
              className="w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] border-[#E7E7E7] focus:border-[#2E92A0]"
            />
          </div>
        )}
        {userType && (
        <div className="grid grid-cols-2 md:grid-cols-2  gap-4 2xl:grid-cols-2">
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrə təyin edin"
              className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
                errors.password
                  ? "border-[#E94134]"
                  : "border-[#E7E7E7] focus:border-[#2E92A0]"
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
          {errors.password && (
            <div className="text-[#E94134] text-sm">{errors.password}</div>
          )}
        </div>
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifrəni təkrarlayın"
              className={`w-full px-4 py-4 border rounded-lg focus:outline-none text-[#3F3F3F] ${
                errors.confirmPassword
                  ? "border-[#E94134]"
                  : "border-[#E7E7E7] focus:border-[#2E92A0]"
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
          {errors.confirmPassword && (
            <div className="text-[#E94134] text-sm">
              {errors.confirmPassword}
            </div>
          )}
        </div>
        </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked && errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }
              }}
              className="w-4 h-4 rounded border-[#E7E7E7] text-[#2E92A0] focus:ring-[#2E92A0]"
            />
            <label htmlFor="terms" className="text-[#3F3F3F] text-sm">
              İstifadəçi şərtlərini oxudum və razıyam
            </label>
          </div>
          {errors.terms && (
            <div className="text-[#E94134] text-sm">{errors.terms}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2E92A0] text-white py-4 px-4 rounded-[16px] hover:bg-[#267A85] transition-colors hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed relative"
        >
          {isLoading ? (
            <div className="inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            (userType ? "Qeydiyyatı tamamla" : "Tip seçin")
          )}
        </button>

        {/* <GradientText
          colors={["#4286F5", "#34A853", "#F9BB04", "#E94134"]}
          animationSpeed={20}
          showBorder={true}
          className="custom-class w-full"
          onClick={() => {console.log("clicked")}}
        >
          Google ilə davam et
        </GradientText> */}
      </form>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_black"
          shape="pill"
          size="large"
          text="continue_with"
          locale="az"
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#0000003f] bg-opacity-50 flex items-center justify-center z-[1001]">
          <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};
