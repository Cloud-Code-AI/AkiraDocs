'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { locales } from '@/hooks/useTranslation';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';

type TranslationContextType = {
  locale: keyof typeof locales;
  setLocale: (locale: keyof typeof locales) => void;
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<keyof typeof locales>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = locales[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 