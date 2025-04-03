import React from 'react';
import { motion } from 'framer-motion';
import { fadeAnimation } from './shared/animations';

const SuccessStep = ({ closeModal }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeAnimation}
    >
      <div className="flex flex-col items-center justify-center p-[32px] space-y-4">
        <div className="w-[48px] h-[48px] rounded-full bg-[#2E92A0] flex items-center justify-center">
          <svg
            width="24"
            height="24"
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
        <h2 className="text-[18px] font-medium text-[#3F3F3F] text-center">
          Uğurla Doğrulandı!
        </h2>
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg hover:bg-[#F5F5F5] transition-colors mt-4"
        >
          Bağla
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessStep; 