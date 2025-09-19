import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDefaultLocale } from '@/lib/env';
import { getOnboardingService } from '@/server/onboarding/onboardingService';

const localeEnum = z.enum(['ko', 'en']);
const resolvedDefaultLocale = (() => {
  const parsed = localeEnum.safeParse(getDefaultLocale());
  return parsed.success ? parsed.data : 'ko';
})();

const payloadSchema = z.object({
  email: z.string().email(),
  term: z.string().min(1),
  stayLength: z.number().int().positive().max(24),
  locale: localeEnum.default(resolvedDefaultLocale),
  preferences: z
    .object({
      notifications: z.boolean().default(true)
    })
    .partial()
    .optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = payloadSchema.parse(body);
    const onboardingService = getOnboardingService();

    await onboardingService.saveProfile(payload.email, {
      term: payload.term,
      stayLength: payload.stayLength,
      locale: payload.locale,
      preferences: payload.preferences
    });

    const profile = await onboardingService.getProfile(payload.email);

    return NextResponse.json(
      {
        message: '온보딩 정보가 저장되었습니다.',
        profile
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: '입력 형식이 올바르지 않습니다.' }, { status: 400 });
    }
    console.error('[onboarding:profile]', error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
