import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import useLanguageStore from "../../store/languageStore";
import { useAuth } from "../../context/AuthContext";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const { language } = useLanguageStore();
  const { login } = useAuth();

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

  const updateUserData = async (token) => {
    try {
      // Fetch updated user data after verification
      const response = await axios.get('https://atfplatform.tw1.ru/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.user) {
        // Get the current user data from localStorage and update it
        const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUserData = {
          ...currentUserData,
          ...response.data.user,
          email_verified_at: new Date().toISOString()
        };
        
        // Update the user data in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        // Update the auth context if needed
        login(updatedUserData, token);
        
        console.log('User data updated after email verification');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // Continue with the verification success flow even if user data update fails
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
        
        // Update user data after successful verification
        await updateUserData(token);
        
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
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin">
              <ImSpinner8 className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-lg font-medium text-gray-700">
              {getText.verifying[language] || getText.verifying.az}
            </p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-4">
            <FaCheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-lg font-medium text-gray-700">
              {getText.success[language] || getText.success.az}
            </p>
            <p className="text-sm text-gray-500">
              {getText.redirecting[language] || getText.redirecting.az}
            </p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-4">
            <FaTimesCircle className="w-16 h-16 text-red-500" />
            <p className="text-lg font-medium text-gray-700">
              {getText.error[language] || getText.error.az}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              {getText.tryAgain[language] || getText.tryAgain.az}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-303px)] flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        {renderStatus()}
      </div>
    </div>
  );
};
