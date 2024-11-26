import { useCallback, useState, useEffect } from 'react';
import en from '../i18n/locales/en';
import es from '../i18n/locales/es';
import de from '../i18n/locales/de';
import fr from '../i18n/locales/fr';

type LocaleKey = string;

export const locales = {
  en,
  es,
  de,
  fr
} as const;

// Get default locale from HTML lang attribute or environment variable
const getDefaultLocale = () => {
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang;
    return (htmlLang && htmlLang in locales) ? htmlLang : 'en';
  }
  return 'en';
};

export function useTranslation() {
  const [locale, setLocale] = useState(getDefaultLocale() as keyof typeof locales);

  const t = useCallback((key: LocaleKey) => {
    const keys = key.split('.');
    let value: any = locales[locale];
    console.log('Translation attempt:', { locale, key, value });
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }, [locale]);

  // Add effect to update HTML lang attribute when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      console.log('Locale changed to:', locale);
    }
  }, [locale]);

  return {
    t,
    locale,
    setLocale,
    locales: Object.keys(locales),
  };
}