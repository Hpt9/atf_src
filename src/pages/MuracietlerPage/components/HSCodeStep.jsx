import React from 'react';
import { motion } from 'framer-motion';
import { slideAnimation } from './shared/animations';

const HSCodeStep = ({ selectedHsCode, setSelectedHsCode, closeModal, setModalStep, custom }) => {
  const handleNext = () => {
    if (!selectedHsCode.trim()) return;
    setModalStep(2);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      custom={custom}
      variants={slideAnimation}
    >
      <div className='mb-2'>
        <input
          type="text"
          placeholder="HS Kodu daxil edin"
          className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          value={selectedHsCode}
          onChange={(e) => setSelectedHsCode(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          Ləğv et
        </button>
        <button
          onClick={handleNext}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            !selectedHsCode.trim() 
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
          disabled={!selectedHsCode.trim()}
        >
          Növbəti
        </button>
      </div>
    </motion.div>
  );
};

export default HSCodeStep; 