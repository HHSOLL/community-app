import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMagicLinkService, MagicLinkError } from '@/server/auth/magicLinkService';
import { checkRateLimit, RateLimitError } from '@/server/rateLimiter';
import { logEvent } from '@/server/analytics/eventLogger';

const payloadSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email } = payloadSchema.parse(json);

    const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    checkRateLimit(`magic-link:${ip}`, 5, 5 * 60 * 1000);
    checkRateLimit(`magic-link:${email}`, 5, 5 * 60 * 1000);
    const service = getMagicLinkService();
    const result = await service.requestMagicLink(email);
    logEvent('magic_link_requested', { email, ip });

    return NextResponse.json(
      {
        message: 'Magic link이 발송되었습니다. 메일함을 확인하세요.',
        debugToken: result.debugToken
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof MagicLinkError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: '입력 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    console.error('[magic-link:request]', error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
