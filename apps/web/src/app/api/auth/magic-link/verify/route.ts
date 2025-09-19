import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMagicLinkService, MagicLinkError } from '@/server/auth/magicLinkService';
import { checkRateLimit, RateLimitError } from '@/server/rateLimiter';
import { createSessionToken, setSessionCookie } from '@/server/auth/session';
import { logEvent } from '@/server/analytics/eventLogger';

const payloadSchema = z.object({
  token: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { token } = payloadSchema.parse(json);

    const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    checkRateLimit(`magic-link-verify:${ip}`, 10, 5 * 60 * 1000);

    const service = getMagicLinkService();
    const { email } = await service.verifyMagicLink(token);

    const sessionToken = await createSessionToken({ email });
    const response = NextResponse.json({ message: '인증이 완료되었습니다.', email }, { status: 200 });
    setSessionCookie(response, sessionToken);
    await logEvent('magic_link_verified', { email, ip });
    return response;
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

    console.error('[magic-link:verify]', error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
