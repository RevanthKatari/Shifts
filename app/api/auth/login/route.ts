import { NextRequest, NextResponse } from 'next/server';
import { isValidCode, getUserIdFromCode, setUserSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!isValidCode(code)) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const userId = getUserIdFromCode(code);
    await setUserSession(userId);

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

