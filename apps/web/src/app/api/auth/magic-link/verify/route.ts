import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMagicLinkService, MagicLinkError } from '@/server/auth/magicLinkService';

const payloadSchema = z.object({
  token: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { token } = payloadSchema.parse(json);
    const service = getMagicLinkService();
    const { email } = await service.verifyMagicLink(token);

    return NextResponse.json({ message: '인증이 완료되었습니다.', email }, { status: 200 });
  } catch (error) {
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
