'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Locale, TranslationKeys } from './types';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';

const STORAGE_KEY = 'metronome-locale';
const DEFAULT_LOCALE: Locale = 'zh';

const translations: Record<Locale, TranslationKeys> = { zh, en, ja };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start with default locale to match server-rendered HTML
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore stored locale after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ja') {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {}
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {}
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : newLocale;
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
