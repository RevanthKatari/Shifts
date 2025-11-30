import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';

export async function GET() {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ userId });
}

