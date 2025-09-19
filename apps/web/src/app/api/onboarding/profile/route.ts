import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDefaultLocale } from '@/lib/env';

const localeEnum = z.enum(['ko', 'en']);
const resolvedDefaultLocale = (() => {
  const parsed = localeEnum.safeParse(getDefaultLocale());
  return parsed.success ? parsed.data : 'ko';
})();

const payloadSchema = z.object({
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

    return NextResponse.json(
      {
        message: '온보딩 정보가 임시 저장되었습니다.',
        profile: payload,
        // TODO: Replace with persistence layer once Supabase/Neon integration is ready.
        note: '현재는 임시 응답이며, 이후 DB에 저장하도록 확장합니다.'
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
