import React from 'react';
import { motion } from 'framer-motion';
import { slideAnimation } from './shared/animations';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const HSCodeStep = ({ selectedHsCode = "", setSelectedHsCode, closeModal, setModalStep, custom }) => {
  const { token } = useAuth();

  const handleNext = async () => {
    if (!selectedHsCode || !selectedHsCode.trim()) return;
    
    try {
      // Convert HS code to number
      const hsCodeNumber = parseInt(selectedHsCode.trim(), 10);
      
      if (isNaN(hsCodeNumber)) {
        console.error('Invalid HS code: not a number');
        return;
      }

      const response = await axios.post(
        'https://atfplatform.tw1.ru/api/code-categories-documents',
        { hs_code: hsCodeNumber },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('API Response:', response.data);
      setModalStep(2);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // You might want to show an error message to the user here
    }
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
          value={selectedHsCode || ""}
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
            !selectedHsCode || !selectedHsCode.trim() 
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
          disabled={!selectedHsCode || !selectedHsCode.trim()}
        >
          Növbəti
        </button>
      </div>
    </motion.div>
  );
};

export default HSCodeStep; 