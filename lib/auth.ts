import { cookies } from 'next/headers';

// Get passcodes from environment variables
const USER_1_CODE = process.env.USER_1_PASSCODE || '2338';
const USER_2_CODE = process.env.USER_2_PASSCODE || '2339';

const VALID_CODES = [USER_1_CODE, USER_2_CODE];

export function isValidCode(code: string): boolean {
  return VALID_CODES.includes(code);
}

export function getUserIdFromCode(code: string): string {
  return code === USER_1_CODE ? 'user_2338' : 'user_2339';
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('userId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getUserSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  return userId || null;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
}

