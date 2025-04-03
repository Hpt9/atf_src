import React from 'react';

const FormStep = ({ formData, handleInputChange, closeModal, handleFormSubmit }) => {
  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <div className="p-[16px] space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Adınız"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
          <input
            type="text"
            name="surname"
            placeholder="Soyadınız"
            value={formData.surname}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
        </div>
        {[
          { name: 'productName', placeholder: 'Məhsulun adı' },
          { name: 'invoiceValue', placeholder: 'İnvoys qiyməti' },
          { name: 'quantity', placeholder: 'Miqdarı' },
          { name: 'legalPersonName', placeholder: 'Hüquqi şəxsin adı' }
        ].map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          Ləğv et
        </button>
        <button
          onClick={handleFormSubmit}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            !isFormValid()
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
          disabled={!isFormValid()}
        >
          Təsdiq edin
        </button>
      </div>
    </div>
  );
};

export default FormStep; 