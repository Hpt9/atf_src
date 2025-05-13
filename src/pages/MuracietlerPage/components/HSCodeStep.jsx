import React, { useState } from 'react';
import useLanguageStore from '../../../store/languageStore';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const HSCodeStep = ({ selectedHsCode = "", setSelectedHsCode, closeModal, setModalStep }) => {
  const { language } = useLanguageStore();
  const { user } = useAuth();
  const [validationError, setValidationError] = useState("");

  const texts = {
    hsCodePlaceholder: {
      en: "Enter HS Code",
      ru: "Введите код HS",
      az: "HS Kodu daxil edin"
    },
    cancel: {
      en: "Cancel",
      ru: "Отмена",
      az: "Ləğv et"
    },
    next: {
      en: "Next",
      ru: "Далее",
      az: "Növbəti"
    },
    errorMessages: {
      onlyNumbers: {
        en: "Only numbers are allowed",
        ru: "Разрешены только цифры",
        az: "Yalnız rəqəmlər daxil edilə bilər"
      },
      inputRequired: {
        en: "Please enter HS Code",
        ru: "Пожалуйста, введите HS код",
        az: "HS Kodu daxil edin"
      },
      emailNotVerified: {
        en: "Please verify your email to view documents",
        ru: "Пожалуйста, подтвердите свою электронную почту, чтобы просмотреть документы",
        az: "Sənədləri görmək üçün e-poçt ünvanınızı təsdiqləməlisiniz"
      }
    }
  };

  const handleInputChange = function(e) {
    var value = e.target.value;
    
    if (value && !/^\d+$/.test(value)) {
      setValidationError(texts.errorMessages.onlyNumbers[language] || texts.errorMessages.onlyNumbers.az);
      toast.error(texts.errorMessages.onlyNumbers[language] || texts.errorMessages.onlyNumbers.az);
      return;
    }
    
    setSelectedHsCode(value);
    setValidationError("");
  };

  const handleNext = function() {
    // Blur active element to hide keyboard on mobile
    if (document.activeElement) {
      document.activeElement.blur();
    }
    
    // Simple validation
    if (!selectedHsCode || selectedHsCode.trim() === "") {
      setValidationError(texts.errorMessages.inputRequired[language] || texts.errorMessages.inputRequired.az);
      return;
    }
    
    // Check if user's email is verified
    if (user && user.email_verified_at === null) {
      // Email not verified - show toast notification
      toast.error(texts.errorMessages.emailNotVerified[language] || texts.errorMessages.emailNotVerified.az, {
        duration: 5000,
        position: 'top-right',
        id: 'email-verification-required',
      });
      return;
    }
    
    // Directly move to next step without any async operations
    setModalStep(2);
  };

  return (
    <div className="hscode-step">
      <div className='mb-2'>
        <input
          type="text"
          placeholder={texts.hsCodePlaceholder[language] || texts.hsCodePlaceholder.az}
          className={`w-full px-4 py-2 border ${validationError ? 'border-red-500' : 'border-[#E7E7E7]'} rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]`}
          value={selectedHsCode || ""}
          onChange={handleInputChange}
          inputMode="numeric" 
          pattern="[0-9]*"
        />
        {validationError && (
          <p className="text-red-500 text-sm mt-1">{validationError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          {texts.cancel[language] || texts.cancel.az}
        </button>
        <button
          onClick={handleNext}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            !selectedHsCode || !selectedHsCode.trim() || validationError
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
          disabled={!selectedHsCode || !selectedHsCode.trim() || !!validationError}
        >
          {texts.next[language] || texts.next.az}
        </button>
      </div>
    </div>
  );
};

export default HSCodeStep;
