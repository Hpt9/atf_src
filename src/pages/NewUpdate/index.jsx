import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoCamera } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

export const NewUpdate = () => {
  const [activeTab, setActiveTab] = useState("elan"); // 'elan' or 'kataloq'

  // Separate state for Elan (Announcement) form
  const [elanFormData, setElanFormData] = useState({
    elanAdi: "",
    haradanGelir: "",
    haraGelir: "",
    neDasir: "",
    neQederDasir: "",
    neVaxCixir: "",
    neVaxCatir: "",
    yukTutumu: "",
    yukTutumuVahid: "",
    yukGatirenAdi: "",
    yukGatirenMobil: "",
    elaveMelumat: "",
    sekil: null,
  });

  // Separate state for Kataloq (Catalog) form
  const [kataloqFormData, setKataloqFormData] = useState({
    sirketAdi: "",
    neceBiriVar: "",
    bosTirininSayi: "",
    voen: "",
    elaqeNomresi: "",
    email: "",
    vebsaytLinki: "",
    filiallar: [],
    kataloqElaveMelumat: "",
    sekil: null,
  });

  const handleElanInputChange = (field, value) => {
    setElanFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKataloqInputChange = (field, value) => {
    setKataloqFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleElanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setElanFormData((prev) => ({
        ...prev,
        sekil: file,
      }));
    }
  };

  const handleKataloqFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKataloqFormData((prev) => ({
        ...prev,
        sekil: file,
      }));
    }
  };

  const handleElanSubmit = (e) => {
    e.preventDefault();
    console.log("Elan form data:", elanFormData);
    // Handle Elan form submission here
  };

  const handleKataloqSubmit = (e) => {
    e.preventDefault();
    console.log("Kataloq form data:", kataloqFormData);
    // Handle Kataloq form submission here
  };

  const addFilial = () => {
    setKataloqFormData((prev) => ({
      ...prev,
      filiallar: [...prev.filiallar, ""],
    }));
  };

  const updateFilial = (index, value) => {
    setKataloqFormData((prev) => ({
      ...prev,
      filiallar: prev.filiallar.map((filial, i) =>
        i === index ? value : filial
      ),
    }));
  };

  const removeFilial = (index) => {
    setKataloqFormData((prev) => ({
      ...prev,
      filiallar: prev.filiallar.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-4 md:py-8">
        <div className="bg-[#F4F4F4] rounded-[16px] p-4 md:p-8">
          {/* Title */}
          <h1 className="text-[24px] font-semibold text-[#2E92A0] mb-6">
            Elanın məlumatlarını daxil edin
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-[#E7E7E7] mb-6">
            <button
              onClick={() => setActiveTab("elan")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "elan"
                  ? "text-[#2E92A0] border-b-2 border-[#2E92A0]"
                  : "text-[#6B7280] hover:text-[#2E92A0]"
              }`}
            >
              Elan
            </button>
            <button
              onClick={() => setActiveTab("kataloq")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "kataloq"
                  ? "text-[#2E92A0] border-b-2 border-[#2E92A0]"
                  : "text-[#6B7280] hover:text-[#2E92A0]"
              }`}
            >
              Kataloq
            </button>
          </div>
          <AnimatePresence mode="wait">
            {/* Elan Form */}
            {activeTab === "elan" && (
              <motion.form 
                key="elan-form"
                onSubmit={handleElanSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Elanın adı
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.elanAdi}
                      onChange={(e) =>
                        handleElanInputChange("elanAdi", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Elanın adını daxil edin"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Haradan gəlir
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.haradanGelir}
                      onChange={(e) =>
                        handleElanInputChange("haradanGelir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Haradan gəlir"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Hara gəlir
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.haraGelir}
                      onChange={(e) =>
                        handleElanInputChange("haraGelir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Hara gəlir"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Nə daşıyır
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.neDasir}
                      onChange={(e) =>
                        handleElanInputChange("neDasir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Nə daşıyır"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Nə qədər daşıyır
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.neQederDasir}
                      onChange={(e) =>
                        handleElanInputChange("neQederDasir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Nə qədər daşıyır"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Nə vaxt çıxır
                    </label> */}
                    <input
                      type="datetime-local"
                      value={elanFormData.neVaxCixir}
                      onChange={(e) =>
                        handleElanInputChange("neVaxCixir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Nə vaxt çatır (təxmini)
                    </label> */}
                    <input
                      type="datetime-local"
                      value={elanFormData.neVaxCatir}
                      onChange={(e) =>
                        handleElanInputChange("neVaxCatir", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                    />
                  </div>

                  <div className="flex w-full">
                    <div className="w-[80%]">
                      {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                        Yük tutumu
                      </label> */}
                      <input
                        type="text"
                        value={elanFormData.yukTutumu}
                        onChange={(e) =>
                          handleElanInputChange("yukTutumu", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-l-lgfocus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                        placeholder="Yük tutumu"
                      />
                    </div>
                    <div className="w-[20%]">
                      {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                        Vahid
                      </label> */}
                      <select
                        value={elanFormData.yukTutumuVahid}
                        onChange={(e) =>
                          handleElanInputChange(
                            "yukTutumuVahid",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-r-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      >
                        <option value="">Seçin</option>
                        <option value="ton">Ton</option>
                        <option value="kq">Kq</option>
                        <option value="litr">Litr</option>
                        <option value="metr">Metr</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Yük gətirənin adı soyadı
                    </label> */}
                    <input
                      type="text"
                      value={elanFormData.yukGatirenAdi}
                      onChange={(e) =>
                        handleElanInputChange("yukGatirenAdi", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Adı və soyadı"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Yük gətirənin mobil nömrəsi
                    </label> */}
                    <input
                      type="tel"
                      value={elanFormData.yukGatirenMobil}
                      onChange={(e) =>
                        handleElanInputChange("yukGatirenMobil", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="+994"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Əlavə məlumat
                    </label> */}
                    <textarea
                      value={elanFormData.elaveMelumat}
                      onChange={(e) =>
                        handleElanInputChange("elaveMelumat", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                      placeholder="Əlavə məlumatlar..."
                    />
                  </div>
                  <div className="mt-6">
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                  Şəkil əlavə edin
                </label> */}
                    <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-6 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleElanFileChange}
                        className="hidden"
                        id="elan-image-upload"
                      />
                      <label
                        htmlFor="elan-image-upload"
                        className="cursor-pointer"
                      >
                        <IoCamera className="mx-auto text-4xl text-[#2E92A0] mb-2" />
                        <p className="text-[#2E92A0] font-medium">Şəkil əlavə edin</p>
                        {elanFormData.sekil && (
                          <p className="text-sm text-[#2E92A0] mt-2">
                            Seçilmiş: {elanFormData.sekil.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                  type="button"
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2"
                >
                  Tamamla
                </button>
              </div>
            </motion.form>
          )}

          {/* Kataloq Form */}
          {activeTab === "kataloq" && (
            <motion.form 
              key="kataloq-form"
              onSubmit={handleKataloqSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Şirkətin adı
                    </label> */}
                    <input
                      type="text"
                      value={kataloqFormData.sirketAdi}
                      onChange={(e) =>
                        handleKataloqInputChange("sirketAdi", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Şirkətin adını daxil edin"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Neçə biri var
                    </label> */}
                    <input
                      type="text"
                      value={kataloqFormData.neceBiriVar}
                      onChange={(e) =>
                        handleKataloqInputChange("neceBiriVar", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="Neçə biri var"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Boş tırının sayı
                    </label> */}
                    <input
                      type="number"
                      value={kataloqFormData.bosTirininSayi}
                      onChange={(e) =>
                        handleKataloqInputChange(
                          "bosTirininSayi",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      VÖEN
                    </label> */}
                    <input
                      type="text"
                      value={kataloqFormData.voen}
                      onChange={(e) =>
                        handleKataloqInputChange("voen", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="VÖEN nömrəsi"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Əlaqə nömrəsi
                    </label> */}
                    <input
                      type="tel"
                      value={kataloqFormData.elaqeNomresi}
                      onChange={(e) =>
                        handleKataloqInputChange("elaqeNomresi", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="+994"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      E-poçt ünvanı
                    </label> */}
                    <input
                      type="email"
                      value={kataloqFormData.email}
                      onChange={(e) =>
                        handleKataloqInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] placeholder:font-medium"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Vebsayt linki
                    </label> */}
                    <input
                      type="url"
                      value={kataloqFormData.vebsaytLinki}
                      onChange={(e) =>
                        handleKataloqInputChange("vebsaytLinki", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0]"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    {/* Filiallar Header */}
                    <div className="bg-white border border-[#E7E7E7] rounded-lg px-4 py-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#2E92A0] font-medium">
                          Filiallar
                        </span>
                        <button
                          type="button"
                          onClick={addFilial}
                          className="text-[#2E92A0] hover:text-[#267A85] transition-colors"
                        >
                          <IoAdd size={24} />
                        </button>
                      </div>
                    </div>

                    {/* Filiallar List */}
                    <div className="space-y-3">
                      <AnimatePresence>
                        {kataloqFormData.filiallar.map((filial, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0, scale: 0.8 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center gap-3"
                          >
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeFilial(index)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            >
                              <span className="text-xl font-bold">−</span>
                            </button>

                            {/* Filial Name Input */}
                            <input
                              type="text"
                              value={filial}
                              onChange={(e) =>
                                updateFilial(index, e.target.value)
                              }
                              className="flex-1 px-4 py-3 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] bg-white"
                              placeholder="Filialın adı"
                            />

                            {/* Image Upload Button */}
                            <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-3 cursor-pointer hover:border-[#267A85] transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    // Handle filial image upload here
                                    console.log(`Filial ${index} image:`, file);
                                  }
                                }}
                                className="hidden"
                                id={`filial-image-${index}`}
                              />
                              <label
                                htmlFor={`filial-image-${index}`}
                                className="cursor-pointer flex items-center gap-2 text-[#2E92A0]"
                              >
                                <IoCamera size={16} />
                                <span className="text-sm">Şəkil əlavə edin</span>
                              </label>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    {/* <label className="block text-sm font-medium text-[#3F3F3F] mb-2">
                      Əlavə məlumat
                    </label> */}
                    <textarea
                      value={kataloqFormData.kataloqElaveMelumat}
                      onChange={(e) =>
                        handleKataloqInputChange(
                          "kataloqElaveMelumat",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D3D3D3] bg-white rounded-lg focus:outline-none focus:border-[#2E92A0] resize-none placeholder:font-medium"
                      placeholder="Əlavə məlumatlar..."
                    />
                  </div>
                  <div className="border-2 border-dashed border-[#2E92A0] rounded-lg p-6 text-center hover:border-[#2E92A0] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleKataloqFileChange}
                      className="hidden"
                      id="kataloq-image-upload"
                    />
                    <label
                      htmlFor="kataloq-image-upload"
                      className="cursor-pointer"
                    >
                      <IoCamera className="mx-auto text-4xl text-[#2E92A0] mb-2" />
                      <p className="text-[#2E92A0] font-medium">Şəkil əlavə edin</p>
                      {kataloqFormData.sekil && (
                        <p className="text-sm text-[#2E92A0] mt-2">
                          Seçilmiş: {kataloqFormData.sekil.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                  type="button"
                  className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2"
                >
                  Tamamla
                </button>
              </div>
            </motion.form>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
