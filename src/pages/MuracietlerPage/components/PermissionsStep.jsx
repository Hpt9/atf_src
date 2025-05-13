import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import useLanguageStore from '../../../store/languageStore';

const PermissionsStep = ({ selectedHsCode, setModalStep, closeModal, refreshApplications, setDocumentName }) => {
  const { token } = useAuth();
  const { language } = useLanguageStore();
  const [approvals, setApprovals] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Text translations
  const texts = {
    hsCodeTitle: {
      en: "HS Code:",
      ru: "HS Код:",
      az: "HS Kodu:"
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
    sending: {
      en: "Sending...",
      ru: "Отправка...",
      az: "Göndərilir..."
    },
    noApprovals: {
      en: "No approvals found for this HS Code",
      ru: "Не найдены разрешения для данного HS кода",
      az: "Bu HS Kod üçün icazələr tapılmadı"
    },
    retryFetch: {
      en: "Retry",
      ru: "Повторить",
      az: "Yenidən cəhd edin"
    },
    errorMessages: {
      approvalsLoadFailed: {
        en: "Failed to load approvals",
        ru: "Не удалось загрузить разрешения",
        az: "İcazələri yükləmək mümkün olmadı"
      },
      requestFailed: {
        en: "Request was not sent. Please try again.",
        ru: "Запрос не отправлен. Пожалуйста, попробуйте еще раз.",
        az: "Müraciət göndərilmədi. Xahiş edirik yenidən cəhd edin."
      }
    }
  };

  // Fetch approvals based on HS code
  function fetchApprovals() {
    setIsLoading(true);
    
    // Ensure HS code is a valid number
    let hsCodeInt;
    try {
      hsCodeInt = parseInt(selectedHsCode, 10);
      if (isNaN(hsCodeInt)) {
        hsCodeInt = 0;
      }
    } catch (e) {
      console.error('Invalid HS code', e);
      hsCodeInt = 0;
    }
    
    console.log('Fetching approvals for HS code:', hsCodeInt);

    // Use axios instead of XMLHttpRequest for better compatibility
    axios({
      method: 'POST',
      url: 'https://atfplatform.tw1.ru/api/code-categories-documents',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: { hs_code: hsCodeInt }
    })
    .then(function(response) {
      console.log('Approvals fetch successful:', response.data);
      if (response.data && response.data.approvals) {
        setApprovals(response.data.approvals);
      } else {
        setApprovals([]);
      }
      setIsLoading(false);
    })
    .catch(function(error) {
      console.error('Error fetching approvals:', error);
      toast.error(texts.errorMessages.approvalsLoadFailed[language] || texts.errorMessages.approvalsLoadFailed.az);
      setApprovals([]);
      setIsLoading(false);
    });
  }

  // Trigger fetch on component mount and when dependencies change
  useEffect(function() {
    fetchApprovals();
  }, [selectedHsCode, token, language, fetchTrigger]);

  function handleApprovalChange(approvalId) {
    if (isSubmitting) return;
    
    setSelectedApprovals(function(prev) {
      const index = prev.indexOf(approvalId);
      if (index !== -1) {
        const newSelected = [...prev];
        newSelected.splice(index, 1);
        return newSelected;
      } else {
        return [...prev, approvalId];
      }
    });
  }

  function handleNext() {
    if (selectedApprovals.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setDocumentName(selectedApprovals);
    
    axios({
      method: 'POST',
      url: 'https://atfplatform.tw1.ru/api/code-categories-downloads',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: {
        hs_code: parseInt(selectedHsCode, 10),
        approval_ids: selectedApprovals
      }
    })
    .then(function(response) {
      console.log('Success Response:', response.data);
      setModalStep(3); // Go to success step
      
      // Refresh the applications list after successful submission
      setTimeout(function() {
        refreshApplications();
      }, 1000);
    })
    .catch(function(error) {
      console.error('Error submitting request:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(texts.errorMessages.requestFailed[language] || texts.errorMessages.requestFailed.az);
      }
      setIsSubmitting(false);
    });
  }

  function handleRetryFetch() {
    setFetchTrigger(prev => prev + 1);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[18px] font-medium text-[#3F3F3F] flex-1">
          {texts.hsCodeTitle[language] || texts.hsCodeTitle.az} {selectedHsCode}
        </h2>
      </div>

      {approvals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 gap-4">
          <p className="text-[#3F3F3F]">
            {texts.noApprovals[language] || texts.noApprovals.az}
          </p>
          <button
            onClick={handleRetryFetch}
            className="py-2 px-4 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85]"
          >
            {texts.retryFetch[language] || texts.retryFetch.az}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(function(approval) {
            return (
              <div key={approval.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={"approval-" + approval.id}
                  checked={selectedApprovals.indexOf(approval.id) !== -1}
                  onChange={function() { handleApprovalChange(approval.id); }}
                  disabled={isSubmitting}
                  className={"w-4 h-4 text-[#2E92A0] border-[#E7E7E7] rounded focus:ring-[#2E92A0] " +
                    (isSubmitting ? "cursor-not-allowed opacity-50" : "")}
                />
                <label
                  htmlFor={"approval-" + approval.id}
                  className={"text-[#3F3F3F] " +
                    (isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
                >
                  {approval.title}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={closeModal}
          disabled={isSubmitting}
          className={"w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg " +
            (isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#F5F5F5] transition-colors")}
        >
          {texts.cancel[language] || texts.cancel.az}
        </button>
        <button
          onClick={handleNext}
          disabled={selectedApprovals.length === 0 || isSubmitting}
          className={"w-full py-2 px-4 rounded-lg transition-colors relative " +
            (selectedApprovals.length === 0 || isSubmitting
              ? "bg-gray-300 cursor-not-allowed text-white"
              : "bg-[#2E92A0] text-white hover:bg-[#267A85]")}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {texts.sending[language] || texts.sending.az}
            </div>
          ) : (
            texts.next[language] || texts.next.az
          )}
        </button>
      </div>
    </div>
  );
};

export default PermissionsStep; 