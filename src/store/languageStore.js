import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(
  persist(
    (set) => ({
      language: localStorage.getItem('language-store')?.state?.language || 'az', // default language
      setLanguage: (newLanguage) => set({ language: newLanguage }),
    }),
    {
      name: 'language-store', // unique name for localStorage
    }
  )
);

export default useLanguageStore; 