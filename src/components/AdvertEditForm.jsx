import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

function toInputDateTime(value) {
    if (!value) return "";
    if (value.includes("T")) return value.slice(0, 16);
    // For "Y-m-d H:i:s" => "YYYY-MM-DDTHH:mm"
    return value.replace(" ", "T").slice(0, 16);
}
function toBackendDateTime(value) {
    if (!value) return "";
    // For "YYYY-MM-DDTHH:mm" => "Y-m-d H:i:s"
    return value.replace("T", " ") + ":00";
}

export default function AdvertEditForm({
    editingAdvertData,
    handleAdvertInputChange,
    handleAdvertFileChange,
    handleAdvertSubmit,
    isSubmittingAdvert,
    setIsEditingAdvert,
    setEditingAdvertData,
    activeAdvertLangTab,
    setActiveAdvertLangTab,
    userData

}

) {

    if (!editingAdvertData) return null;
    const [areas, setAreas] = useState([]);
    const [units, setUnits] = useState([]);
    const [truckTypes, setTruckTypes] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { token } = useAuth();
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setIsDataLoading(true);
            try {
                const headers = {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    Accept: 'application/json',
                };

                const [areasRes, unitsRes, truckTypesRes] = await Promise.all([
                    axios.get('https://atfplatform.tw1.ru/api/areas', { headers }),
                    axios.get('https://atfplatform.tw1.ru/api/units', { headers }),
                    axios.get('https://atfplatform.tw1.ru/api/truck-types', { headers })
                ]);
                if (!cancelled) {
                    setAreas(areasRes.data?.data || []);
                    setUnits(unitsRes.data?.data || []);
                    setTruckTypes(truckTypesRes.data?.data || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setAreas([]);
                    setUnits([]);
                    setTruckTypes([]);
                }
            } finally {
                if (!cancelled) setIsDataLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true; };
    }, []);
    return (
        <form onSubmit={handleAdvertSubmit} className="space-y-6">
            <div className="flex mb-4 gap-2">
                {["az", "en", "ru"].map((lang) => (
                    <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveAdvertLangTab(lang)}
                        className={`px-4 py-2 rounded font-bold border-b-2 transition-all ${activeAdvertLangTab === lang
                            ? "border-[#2E92A0] text-[#2E92A0]"
                            : "border-transparent text-[#27272A]"
                            }`}
                    >
                        {lang === "az" ? "AZƏRBAYCAN" : lang === "en" ? "İNGLİS" : "RUS"}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAdvertLangTab === 'az' && (
                    <div>
                        <label>Elanın adı (AZ)</label>
                        <input
                            type="text"
                            value={editingAdvertData.name_az || ""}
                            onChange={(e) => handleAdvertInputChange("name_az", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Elanın adı (AZ)"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'en' && (
                    <div>
                        <label>Elanın adı (EN)</label>
                        <input
                            type="text"
                            value={editingAdvertData.name_en || ""}
                            onChange={(e) => handleAdvertInputChange("name_en", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Advert name (EN)"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'ru' && (
                    <div>
                        <label>Elanın adı (RU)</label>
                        <input
                            type="text"
                            value={editingAdvertData.name_ru || ""}
                            onChange={(e) => handleAdvertInputChange("name_ru", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Название объявления (RU)"
                        />
                    </div>
                )}

                {activeAdvertLangTab === 'az' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yük növü (AZ)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.load_type_az || ""}
                            onChange={(e) => handleAdvertInputChange("load_type_az", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Yük növü"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'en' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yük növü (EN)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.load_type_en || ""}
                            onChange={(e) => handleAdvertInputChange("load_type_en", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Load type"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'ru' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yük növü (RU)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.load_type_ru || ""}
                            onChange={(e) => handleAdvertInputChange("load_type_ru", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Тип груза"
                        />
                    </div>
                )}

                {/* EXIT FROM ADDRESS - multilingual */}
                {activeAdvertLangTab === 'az' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Çıxış ünvanı (AZ)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.exit_from_address_az || ""}
                            onChange={(e) => handleAdvertInputChange("exit_from_address_az", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Çıxış ünvanı (AZ)"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'en' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Çıxış ünvanı (EN)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.exit_from_address_en || ""}
                            onChange={(e) => handleAdvertInputChange("exit_from_address_en", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Exit address (EN)"
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'ru' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Çıxış ünvanı (RU)
                        </label>
                        <input
                            type="text"
                            value={editingAdvertData.exit_from_address_ru || ""}
                            onChange={(e) => handleAdvertInputChange("exit_from_address_ru", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            placeholder="Адрес отправления (RU)"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tutum
                    </label>
                    <input
                        type="text"
                        value={editingAdvertData.capacity || ""}
                        onChange={(e) => handleAdvertInputChange("capacity", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        placeholder="Tutum"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vahid
                    </label>
                    <select
                        value={editingAdvertData.unit_id || ""}
                        onChange={(e) => handleAdvertInputChange("unit_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                    >
                        <option value="">Vahid</option>
                        {units && units.map((unit, index) => (
                            <option key={unit.id || index} value={unit.id || index}>
                                {unit.type?.az || unit.type?.en || unit.type?.ru || `Unit ${index + 1}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Çatış tarixi
                    </label>
                    <input
                        type="datetime-local"
                        value={toInputDateTime(editingAdvertData.reach_from_address)}
                        onChange={e => handleAdvertInputChange(
                            "reach_from_address",
                            toBackendDateTime(e.target.value)
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        placeholder="Çatış tarixi"
                    />
                </div>

                {/* Replace Haradan/Hara ID text input fields with selects */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Haradan (Ərazi)
                    </label>
                    <select
                        value={editingAdvertData.from_id || ""}
                        onChange={(e) => handleAdvertInputChange("from_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                    >
                        <option value="">Haradan Çıxılacaq Seç</option>
                        {areas && areas.map((area, index) => (
                            <option key={area.id || index} value={area.id || index}>
                                {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hara (Ərazi)
                    </label>
                    <select
                        value={editingAdvertData.to_id || ""}
                        onChange={(e) => handleAdvertInputChange("to_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                        disabled={isDataLoading}
                    >
                        <option value="">Hara Çatdırılacaq Seç</option>
                        {areas && areas.map((area, index) => (
                            <option key={area.id || index} value={area.id || index}>
                                {`${area.country?.az || area.country?.en || area.country?.ru || ''} - ${area.city?.az || area.city?.en || area.city?.ru || ''} - ${area.region?.az || area.region?.en || area.region?.ru || ''}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DESCRIPTION - multilingual */}
                {activeAdvertLangTab === 'az' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir (AZ)</label>
                        <textarea
                            value={editingAdvertData.description_az || ""}
                            onChange={(e) => handleAdvertInputChange("description_az", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            rows={3}
                            placeholder="Təsvir (AZ)..."
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'en' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir (EN)</label>
                        <textarea
                            value={editingAdvertData.description_en || ""}
                            onChange={(e) => handleAdvertInputChange("description_en", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            rows={3}
                            placeholder="Description (EN)..."
                        />
                    </div>
                )}
                {activeAdvertLangTab === 'ru' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir (RU)</label>
                        <textarea
                            value={editingAdvertData.description_ru || ""}
                            onChange={(e) => handleAdvertInputChange("description_ru", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            rows={3}
                            placeholder="Описание (RU)..."
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bitmə tarixi
                    </label>
                    <input
                        type="date"
                        value={editingAdvertData.expires_at || ""}
                        onChange={(e) => handleAdvertInputChange("expires_at", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                    />
                </div>

                {/* Individual and Legal specific fields */}
                {(userData?.role === "individual" || userData?.role === "legal_entity") && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boş yer
                            </label>
                            <input
                                type="text"
                                value={editingAdvertData.empty_space || ""}
                                onChange={(e) => handleAdvertInputChange("empty_space", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                placeholder="Boş yer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tır növü
                            </label>
                            <select
                                value={editingAdvertData.truck_type_id || ""}
                                onChange={(e) => handleAdvertInputChange("truck_type_id", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                disabled={isDataLoading}
                            >
                                <option value="">Tır növü seçin</option>
                                {truckTypes && truckTypes.map((t, index) => (
                                    <option key={t.id || index} value={t.id || index}>
                                        {t.type?.az || t.type?.en || t.type?.ru || `Truck Type ${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tır qeydiyyat nömrəsi
                            </label>
                            <input
                                type="text"
                                value={editingAdvertData.truck_registration_number || ""}
                                onChange={(e) => handleAdvertInputChange("truck_registration_number", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                placeholder="Tır qeydiyyat nömrəsi"
                            />
                        </div>
                    </>
                )}

                {/* Legal entity specific fields */}
                {userData?.role === "legal_entity" && (
                    <>
                        {/* DRIVER FULL NAME - multilingual */}
                        {activeAdvertLangTab === 'az' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün adı soyadı (AZ)</label>
                                <input
                                    type="text"
                                    value={editingAdvertData.driver_full_name_az || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_full_name_az", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    placeholder="Sürücünün adı soyadı (AZ)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'en' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün adı soyadı (EN)</label>
                                <input
                                    type="text"
                                    value={editingAdvertData.driver_full_name_en || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_full_name_en", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    placeholder="Driver full name (EN)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'ru' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün adı soyadı (RU)</label>
                                <input
                                    type="text"
                                    value={editingAdvertData.driver_full_name_ru || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_full_name_ru", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    placeholder="ФИО водителя (RU)"
                                />
                            </div>
                        )}

                        {/* DRIVER BIOGRAPHY - multilingual */}
                        {activeAdvertLangTab === 'az' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün bioqrafiyası (AZ)</label>
                                <textarea
                                    value={editingAdvertData.driver_biography_az || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_biography_az", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Sürücünün bioqrafiyası (AZ)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'en' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün bioqrafiyası (EN)</label>
                                <textarea
                                    value={editingAdvertData.driver_biography_en || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_biography_en", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Driver biography (EN)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'ru' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün bioqrafiyası (RU)</label>
                                <textarea
                                    value={editingAdvertData.driver_biography_ru || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_biography_ru", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Биография водителя (RU)"
                                />
                            </div>
                        )}

                        {/* DRIVER EXPERIENCE - multilingual */}
                        {activeAdvertLangTab === 'az' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün təcrübəsi (AZ)</label>
                                <textarea
                                    value={editingAdvertData.driver_experience_az || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_experience_az", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Sürücünün təcrübəsi (AZ)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'en' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün təcrübəsi (EN)</label>
                                <textarea
                                    value={editingAdvertData.driver_experience_en || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_experience_en", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Driver experience (EN)"
                                />
                            </div>
                        )}
                        {activeAdvertLangTab === 'ru' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sürücünün təcrübəsi (RU)</label>
                                <textarea
                                    value={editingAdvertData.driver_experience_ru || ""}
                                    onChange={(e) => handleAdvertInputChange("driver_experience_ru", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                                    rows={3}
                                    placeholder="Опыт водителя (RU)"
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Entrepreneur specific fields */}
                {userData?.role === "entrepreneur" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tır növü
                        </label>
                        <select
                            value={editingAdvertData.truck_type_id || ""}
                            onChange={(e) => handleAdvertInputChange("truck_type_id", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            disabled={isDataLoading}
                        >
                            <option value="">Tır növü seçin</option>
                            {truckTypes && truckTypes.map((t, index) => (
                                <option key={t.id || index} value={t.id || index}>
                                    {t.type?.az || t.type?.en || t.type?.ru || `Truck Type ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şəkillər
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleAdvertFileChange("photos", e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                    />
                    {editingAdvertData.photos.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            Seçilmiş: {editingAdvertData.photos.length} şəkil
                        </p>
                    )}
                </div>

                {/* Legal entity specific file uploads */}
                {userData?.role === "legal_entity" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sürücü şəkli
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleAdvertFileChange("driver_photo", e.target.files)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sürücü sertifikatları
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleAdvertFileChange("driver_certificates", e.target.files)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E92A0]"
                            />
                            {editingAdvertData.driver_certificates.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Seçilmiş: {editingAdvertData.driver_certificates.length} sənəd
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-[#E7E7E7] w-full">
                <button
                    type="button"
                    disabled={isSubmittingAdvert}
                    className="px-6 py-3 border border-[#2E92A0] text-[#2E92A0] rounded-lg hover:bg-[#F0F9FA] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                        setIsEditingAdvert(null);
                        setEditingAdvertData(null);
                    }}
                >
                    Ləğv et
                </button>
                <button
                    type="submit"
                    disabled={isSubmittingAdvert}
                    className="px-6 py-3 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmittingAdvert ? "Yenilənir..." : "Yadda saxla"}
                </button>
            </div>
        </form>
    );
}