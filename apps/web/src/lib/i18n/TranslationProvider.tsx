'use client';

import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useEffect, useRef } from 'react';
import type { Locale } from './locales';

type TranslationProviderProps = {
  locale: Locale;
  resources: Record<string, unknown>;
  children: ReactNode;
};

function createClient(locale: Locale, resources: Record<string, unknown>): I18nInstance {
  const instance = i18next.createInstance();
  instance.use(initReactI18next);
  instance.init({
    lng: locale,
    fallbackLng: 'ko',
    resources: {
      [locale]: {
        translation: resources
      }
    },
    interpolation: {
      escapeValue: false
    }
  });
  return instance;
}

export function TranslationProvider({ locale, resources, children }: TranslationProviderProps) {
  const i18nRef = useRef<I18nInstance>();
  if (!i18nRef.current) {
    i18nRef.current = createClient(locale, resources);
  } else if (i18nRef.current.language !== locale) {
    void i18nRef.current.changeLanguage(locale);
    i18nRef.current.addResourceBundle(locale, 'translation', resources, true, true);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nextProvider i18n={i18nRef.current!}>{children}</I18nextProvider>;
}
