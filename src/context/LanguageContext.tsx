"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BricsLanguage,
  BRICS_LANGUAGES,
  LanguageInfo,
  getLlmLanguageName,
} from "@/lib/i18n/languages";
import {
  PLATFORM_TRANSLATIONS,
  TranslationsSchema,
} from "@/lib/i18n/translations";

interface LanguageContextType {
  language: BricsLanguage;
  setLanguage: (lang: BricsLanguage) => void;
  t: TranslationsSchema;
  localeInfo: LanguageInfo;
  llmTargetLanguage: string;
}

const STORAGE_KEY = "brics_platform_language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<BricsLanguage>("en");

  // Load language preference from browser localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as BricsLanguage | null;
      if (stored && BRICS_LANGUAGES[stored]) {
        setLanguageState(stored);
      } else {
        // Detect browser default language if matching any BRICS locale
        const browserLang = navigator.language?.toLowerCase() || "";
        if (browserLang.startsWith("hi")) {
          setLanguageState("hi");
        } else if (browserLang.startsWith("pt")) {
          setLanguageState("pt");
        } else if (browserLang.startsWith("ru")) {
          setLanguageState("ru");
        } else if (browserLang.startsWith("zh")) {
          setLanguageState("zh");
        }
      }
    } catch {
      // Fallback to English
    }
  }, []);

  const setLanguage = (newLang: BricsLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      // Update HTML lang attribute dynamically for screen readers & SEO
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {
      // Storage access blocked or SSR
    }
  };

  const t = PLATFORM_TRANSLATIONS[language] || PLATFORM_TRANSLATIONS.en;
  const localeInfo = BRICS_LANGUAGES[language] || BRICS_LANGUAGES.en;
  const llmTargetLanguage = getLlmLanguageName(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        localeInfo,
        llmTargetLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
