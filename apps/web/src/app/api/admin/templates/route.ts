import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSessionEmail } from '@/server/auth/session';
import { getAdminEmails } from '@/lib/env';
import { listTemplates, upsertTemplate } from '@/server/checklists/templatesService';

const upsertSchema = z.object({
  term: z.string().min(1),
  stayLength: z.number().int().min(1).max(24),
  locale: z.string().min(2),
  items: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().default(''),
      category: z.string().min(1),
      position: z.number().int().nonnegative().optional()
    })
  )
});

function ensureAdmin(email: string) {
  const admins = getAdminEmails();
  if (!admins.includes(email.trim().toLowerCase())) {
    throw new Error('관리자 권한이 필요합니다.');
  }
}

export async function GET(request: Request) {
  const email = await requireSessionEmail(request);
  if (!email) {
    return NextResponse.json({ message: '인증 정보가 필요합니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const stayLength = Number(searchParams.get('stayLength'));
  const locale = searchParams.get('locale') ?? 'ko';

  if (!term || Number.isNaN(stayLength)) {
    return NextResponse.json({ message: 'term 또는 stayLength가 필요합니다.' }, { status: 400 });
  }

  try {
    ensureAdmin(email);
  } catch (error) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const template = await listTemplates({ term, stayLength, locale });
  return NextResponse.json({ template }, { status: 200 });
}

export async function POST(request: Request) {
  const email = await requireSessionEmail(request);
  if (!email) {
    return NextResponse.json({ message: '인증 정보가 필요합니다.' }, { status: 401 });
  }

  try {
    ensureAdmin(email);
  } catch (error) {
    return NextResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const body = await request.json();
  const payload = upsertSchema.parse(body);
  await upsertTemplate(payload);
  return NextResponse.json({ message: '템플릿이 저장되었습니다.' }, { status: 200 });
}
