import { NextResponse } from 'next/server';
import { getChecklistService } from '@/server/checklists/checklistService';
import { requireSessionEmail } from '@/server/auth/session';

export async function GET(request: Request) {
  const email = await requireSessionEmail(request);
  if (!email) {
    return NextResponse.json({ message: '인증 정보가 필요합니다.' }, { status: 401 });
  }

  const checklistService = getChecklistService();
  const checklist = await checklistService.getChecklist(email);

  return NextResponse.json({ checklist }, { status: 200 });
}
