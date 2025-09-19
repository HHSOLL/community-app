import { NextResponse } from 'next/server';
import { requireSessionEmail } from '@/server/auth/session';

export async function GET(request: Request) {
  const email = await requireSessionEmail(request);
  if (!email) {
    return NextResponse.json({ email: null }, { status: 200 });
  }

  return NextResponse.json({ email }, { status: 200 });
}
