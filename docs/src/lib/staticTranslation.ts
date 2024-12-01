import en from '../i18n/locales/en';
import es from '../i18n/locales/es';
import de from '../i18n/locales/de';
import fr from '../i18n/locales/fr';

export const locales = {
  en,
  es,
  de,
  fr,
} as const;

export function getTranslation(locale: keyof typeof locales = 'en') {
  const translations = locales[locale] || locales.en;
  
  return function t(key: string | undefined, params?: Record<string, string>) {
    if (!key || typeof key !== 'string') return '';
    
    const keys = key.split('.');
    let translation: any = translations;
    
    for (const k of keys) {
      translation = translation?.[k];
    }

    if (typeof translation !== 'string') return key;

    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    return translation;
  };
}