import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/i18n/dictionaries';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  params,
  children
}: {
  params: { locale: string };
  children: ReactNode;
}) {
  const { locale } = params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dictionary = await getDictionary(locale);

  return (
    <TranslationProvider locale={locale as Locale} resources={dictionary}>
      <div data-locale={locale} className="flex flex-1 flex-col gap-8">
        {children}
      </div>
    </TranslationProvider>
  );
}

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const titleMap: Record<Locale, string> = {
    ko: 'Community App – Cal 교환·유학생 정착 플랫폼',
    en: 'Community App – Cal Exchange & Visiting Student Launchpad'
  };
  return {
    title: titleMap[locale]
  };
}
