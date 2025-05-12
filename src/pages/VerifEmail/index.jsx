import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import useLanguageStore from "../../store/languageStore";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const { language } = useLanguageStore();

  const getText = {
    verifying: {
      en: "Verifying your email...",
      ru: "Проверка вашей электронной почты...",
      az: "Email təsdiqlənir..."
    },
    success: {
      en: "Email successfully verified!",
      ru: "Email успешно подтвержден!",
      az: "Email uğurla təsdiqləndi!"
    },
    redirecting: {
      en: "You will be automatically redirected to your profile page...",
      ru: "Вы будете автоматически перенаправлены на страницу профиля...",
      az: "Siz avtomatik olaraq profil səhifəsinə yönləndiriləcəksiniz..."
    },
    error: {
      en: "Email verification failed",
      ru: "Ошибка при подтверждении email",
      az: "Təsdiqləmə zamanı xəta baş verdi"
    },
    tryAgain: {
      en: "Try again",
      ru: "Попробовать снова",
      az: "Yenidən cəhd edin"
    },
    missingLink: {
      en: "Missing verification link",
      ru: "Отсутствует ссылка для подтверждения",
      az: "Yönləndirmə linki tapılmadı"
    },
    verificationSuccess: {
      en: "Email successfully verified",
      ru: "Email успешно подтвержден",
      az: "Email uğurla təsdiqləndi"
    },
    verificationFailed: {
      en: "Verification failed",
      ru: "Ошибка проверки",
      az: "Təsdiqləmə zamanı xəta baş verdi"
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (!redirectUrl) {
        toast.error(getText.missingLink[language] || getText.missingLink.az);
        setStatus("error");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.get(redirectUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        toast.success(getText.verificationSuccess[language] || getText.verificationSuccess.az);
        setStatus("success");
        // Redirect after showing success animation
        setTimeout(() => navigate("/profile"), 2000);
      } catch (err) {
        console.error(err);
        toast.error(getText.verificationFailed[language] || getText.verificationFailed.az);
        setStatus("error");
      }
    };

    verify();
  }, [redirectUrl, navigate, language]);

  const renderStatus = () => {
    switch (status) {
      case "verifying":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ImSpinner8 className="w-12 h-12 text-blue-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium text-gray-700"
            >
              {getText.verifying[language] || getText.verifying.az}
            </motion.p>
          </motion.div>
        );
      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <FaCheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium text-gray-700"
            >
              {getText.success[language] || getText.success.az}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500"
            >
              {getText.redirecting[language] || getText.redirecting.az}
            </motion.p>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <FaTimesCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium text-gray-700"
            >
              {getText.error[language] || getText.error.az}
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              {getText.tryAgain[language] || getText.tryAgain.az}
            </motion.button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-303px)] flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white rounded-lg shadow-lg"
      >
        {renderStatus()}
      </motion.div>
    </div>
  );
};
