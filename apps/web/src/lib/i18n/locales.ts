export type Locale = 'ko' | 'en';

export const defaultLocale: Locale = 'ko';

export const locales: Locale[] = ['ko', 'en'];

export function isLocale(input: string): input is Locale {
  return locales.includes(input as Locale);
}
