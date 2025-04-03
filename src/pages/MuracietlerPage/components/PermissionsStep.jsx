import React from 'react';

const PermissionsStep = ({ selectedHsCode, setModalStep, closeModal, selectedPermissions, setSelectedPermissions }) => {
  const handlePermissionChange = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setModalStep(1)}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F5F5F5]"
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
        <h2 className="text-[18px] font-medium text-[#3F3F3F] text-right flex-1">
          HS Kodu: {selectedHsCode}
        </h2>
      </div>

      <div className="text-[14px] text-[#3F3F3F] mb-6">
        Lorem ipsum is simply dummy text of the printing and
        typesetting industry. Lorem ipsum has been the
        industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has
        survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged.
      </div>

      <div className="space-y-3">
        {['İcazə 1', 'İcazə 2', 'İcazə 3', 'İcazə 4'].map((permission) => (
          <label key={permission} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)}
              className="w-5 h-5 rounded border-[#E7E7E7] text-[#2E92A0] focus:ring-[#2E92A0]"
            />
            <span className="text-[#3F3F3F]">{permission}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={closeModal}
          className="w-full py-2 px-4 bg-white border border-[#E7E7E7] text-[#3F3F3F] rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          Ləğv et
        </button>
        <button
          onClick={() => setModalStep(3)}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            selectedPermissions.length === 0
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-[#2E92A0] text-white hover:bg-[#267A85]'
          }`}
          disabled={selectedPermissions.length === 0}
        >
          Növbəti
        </button>
      </div>
    </>
  );
};

export default PermissionsStep; 