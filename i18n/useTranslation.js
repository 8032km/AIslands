"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "./en.json";
import ru from "./ru.json";
import de from "./de.json";

const translations = { en, ru, de };
const STORAGE_KEY = "ailands-lang";
const DEFAULT_LANG = "en";

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = useCallback((l) => {
    if (translations[l]) {
      setLangState(l);
      localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, translations: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");

  const t = useCallback(
    (path) => {
      const keys = path.split(".");
      let val = ctx.translations;
      for (const k of keys) {
        if (val == null) return path;
        val = val[k];
      }
      return val ?? path;
    },
    [ctx.translations]
  );

  return { t, lang: ctx.lang, setLang: ctx.setLang };
}
