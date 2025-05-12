import React from 'react';
import { motion } from 'framer-motion';
import { slideAnimation } from './shared/animations';

const SuccessStep = ({ closeModal, custom, approvalPdfs = [], refreshApplications }) => {
  const handleClose = () => {
    closeModal();
    // Refresh the applications list after modal is closed
    refreshApplications();
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      custom={custom}
      variants={slideAnimation}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 bg-[#2E92A0] rounded-full flex items-center justify-center mb-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-[18px] font-medium text-[#3F3F3F] my-2">
        Müraciətiniz qəbul edildi
      </h3>
     

      {approvalPdfs.length > 0 && (
        <div className="w-full space-y-4 mb-6">
          {approvalPdfs.map((approval, index) => (
            <div key={index} className="border border-[#E7E7E7] rounded-lg p-4">
              <h4 className="font-medium text-[#3F3F3F] mb-2">{approval.title}</h4>
              <div className="space-y-2">
                {approval.pdfs.map((pdf, pdfIndex) => (
                  <a
                    key={pdfIndex}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#2E92A0] hover:text-[#267A85] transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    PDF {pdfIndex + 1}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleClose}
        className="w-full py-2 px-4 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
      >
        Bağla
      </button>
    </motion.div>
  );
};

export default SuccessStep; 