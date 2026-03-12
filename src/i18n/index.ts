import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const SUPPORTED = ["es", "en", "fr"];

function detectLang(): string {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem("weddingLang");
  if (stored && SUPPORTED.includes(stored)) return stored;
  const browser = navigator.language.split("-")[0];
  return SUPPORTED.includes(browser) ? browser : "es";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: detectLang(),
    fallbackLng: "es",
    supportedLngs: SUPPORTED,
    interpolation: { escapeValue: false },
  });
}

export function setLang(lang: string) {
  i18n.changeLanguage(lang);
  if (typeof window !== "undefined") localStorage.setItem("weddingLang", lang);
}

export default i18n;
