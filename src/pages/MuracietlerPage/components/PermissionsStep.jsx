import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideAnimation } from './shared/animations';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const PermissionsStep = ({ selectedHsCode, setModalStep, closeModal, custom, refreshApplications }) => {
  const { token } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalPdfs, setApprovalPdfs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const downloadPdf = async (url, filename) => {
    try {
      // Convert the full URL to use local proxy
      const pdfPath = url.split('atfplatform.tw1.ru/storage/')[1];
      const proxyUrl = `/storage/${pdfPath}`;
      
      const response = await axios({
        url: proxyUrl,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename || 'document.pdf'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('PDF yükləmək mümkün olmadı');
    }
  };

  const downloadAllPdfs = async (pdfs) => {
    for (const approval of pdfs) {
      for (const [index, pdf] of approval.pdfs.entries()) {
        const filename = `${approval.title}_${index + 1}.pdf`;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1 second delay between downloads
        await downloadPdf(pdf.url, filename);
      }
    }
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await axios.post(
          'https://atfplatform.tw1.ru/api/code-categories-documents',
          { hs_code: parseInt(selectedHsCode, 10) },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setApprovals(response.data.approvals || []);
      } catch (error) {
        console.error('Error fetching approvals:', error);
        toast.error('İcazələri yükləmək mümkün olmadı');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovals();
  }, [selectedHsCode, token]);

  const handleApprovalChange = (approvalId) => {
    if (isSubmitting) return; // Prevent changes while submitting
    setSelectedApprovals(prev => {
      if (prev.includes(approvalId)) {
        return prev.filter(id => id !== approvalId);
      } else {
        return [...prev, approvalId];
      }
    });
  };

  const handleNext = async () => {
    if (selectedApprovals.length === 0 || isSubmitting) return;

    const finalData = {
      hs_code: parseInt(selectedHsCode, 10),
      approval_ids: selectedApprovals
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://atfplatform.tw1.ru/api/code-categories-downloads',
        finalData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Success Response:', response.data);
      
      // Get PDFs for selected approvals
      const selectedPdfs = approvals
        .filter(approval => selectedApprovals.includes(approval.id))
        .map(approval => ({
          title: approval.title,
          pdfs: approval.pdfs.map(pdf => ({
            ...pdf,
            url: `https://atfplatform.tw1.ru/storage/${pdf.slug}`
          }))
        }));
      
      // Log URLs in a clear format
      console.log('Selected Approvals with URLs:');
      selectedPdfs.forEach(approval => {
        console.log(`\nApproval: ${approval.title}`);
        approval.pdfs.forEach((pdf, index) => {
          console.log(`PDF ${index + 1}: ${pdf.url}`);
        });
      });
      
      setApprovalPdfs(selectedPdfs);
      setModalStep(3); // Go to success step with PDFs
      setIsSuccess(true); // Set success state to true

      // Start downloading PDFs after a short delay
      setTimeout(() => {
        downloadAllPdfs(selectedPdfs);
      }, 1000);

      // Refresh the applications list after successful submission
      setTimeout(() => {
        refreshApplications();
      }, 2000); // Wait 2 seconds after success to refresh the list

    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Müraciət göndərilmədi. Xahiş edirik yenidən cəhd edin.');
      }
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isSubmitting) return; // Prevent navigation while submitting
    setModalStep(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      custom={custom}
      variants={slideAnimation}
    >
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className={`w-[32px] h-[32px] flex items-center justify-center rounded-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F5F5F5]'
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#3F3F3F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="text-[18px] font-medium text-[#3F3F3F] flex-1">
          HS Kodu: {selectedHsCode}
        </h2>
      </div>

      <div className="space-y-4">
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`approval-${approval.id}`}
              checked={selectedApprovals.includes(approval.id)}
              onChange={() => handleApprovalChange(approval.id)}
              disabled={isSubmitting}
              className={`w-4 h-4 text-[#2E92A0] border-[#E7E7E7] rounded focus:ring-[#2E92A0] ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
            <label
              htmlFor={`approval-${approval.id}`}
              className={`text-[#3F3F3F] ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              {approval.title}
            </label>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={closeModal}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#F5F5F5] transition-colors'
          }`}
        >
          Ləğv et
        </button>
        <button
          onClick={handleNext}
          disabled={selectedApprovals.length === 0 || isSubmitting}
          className={`w-full py-2 px-4 rounded-lg transition-colors relative ${
            selectedApprovals.length === 0 || isSubmitting
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Göndərilir...
            </div>
          ) : (
            'Növbəti'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PermissionsStep; 