/**
 * BRICS Agri-Net - Multilateral Internationalization (i18n) Engine
 *
 * Supported Official Member State Languages:
 * - English (en): International lingua franca, South Africa, India
 * - Hindi (hi): India (हिन्दी)
 * - Portuguese (pt): Brazil (Português)
 * - Russian (ru): Russia (Русский)
 * - Chinese (zh): China (中文)
 */

export type BricsLanguage = "en" | "hi" | "pt" | "ru" | "zh";

export interface LanguageInfo {
  code: BricsLanguage;
  name: string;
  nativeName: string;
  countryCode: string;
  countryName: string;
  speechLocale: string;
}

export const BRICS_LANGUAGES: Record<BricsLanguage, LanguageInfo> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    countryCode: "ZA",
    countryName: "International / South Africa",
    speechLocale: "en-US",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    countryCode: "IN",
    countryName: "India",
    speechLocale: "hi-IN",
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    countryCode: "BR",
    countryName: "Brazil",
    speechLocale: "pt-BR",
  },
  ru: {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    countryCode: "RU",
    countryName: "Russia",
    speechLocale: "ru-RU",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    countryCode: "CN",
    countryName: "China",
    speechLocale: "zh-CN",
  },
};

export const SUPPORTED_LANGUAGES_LIST = Object.values(BRICS_LANGUAGES);

/**
 * Maps 2-letter language code to full language name used in LLM generation prompts
 */
export function getLlmLanguageName(lang: BricsLanguage): string {
  switch (lang) {
    case "hi":
      return "Hindi";
    case "pt":
      return "Portuguese";
    case "ru":
      return "Russian";
    case "zh":
      return "Chinese";
    case "en":
    default:
      return "English";
  }
}
