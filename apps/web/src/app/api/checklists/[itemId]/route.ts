import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSessionEmail } from '@/server/auth/session';
import { getChecklistService } from '@/server/checklists/checklistService';
import { logEvent } from '@/server/analytics/eventLogger';

const payloadSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'done'])
});

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  const email = await requireSessionEmail(request);
  if (!email) {
    return NextResponse.json({ message: '인증 정보가 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  const payload = payloadSchema.parse(body);

  const service = getChecklistService();
  const updated = await service.updateItemStatus(email, params.itemId, payload.status);
  if (!updated) {
    return NextResponse.json({ message: '항목을 찾을 수 없습니다.' }, { status: 404 });
  }

  await logEvent('checklist_item_status_changed', {
    email,
    itemId: params.itemId,
    status: payload.status
  });

  return NextResponse.json({ message: '상태가 업데이트되었습니다.' }, { status: 200 });
}
