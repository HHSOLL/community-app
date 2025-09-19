import { OnboardingCallout } from '@/features/onboarding/components/OnboardingCallout';
import { ChecklistPreview } from '@/features/checklists/components/ChecklistPreview';
import { QaPreview } from '@/features/questions/components/QaPreview';
import { GuidePreview } from '@/features/guides/components/GuidePreview';
import { ModerationHighlight } from '@/features/moderation/components/ModerationHighlight';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale, locales } from '@/lib/i18n/locales';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : 'ko';
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.hero.title,
    description: dictionary.hero.subtitle
  };
}

export default async function LocaleHome({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : 'ko';
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">MVP Road to Launch</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{dictionary.hero.title}</h1>
          <p className="mt-2 text-base text-slate-600">{dictionary.hero.subtitle}</p>
        </div>
        <Link
          href="/docs/init-plan"
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
        >
          {dictionary.actions.viewRoadmap}
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <ChecklistPreview />
        <QaPreview />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GuidePreview />
        <ModerationHighlight />
      </section>

      <OnboardingCallout />
    </div>
  );
}
