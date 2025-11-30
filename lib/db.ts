import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

// Initialize database tables - run this once via SQL editor in Supabase
export const initDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    shift_type VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hours DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, shift_type)
  );

  CREATE INDEX IF NOT EXISTS idx_shifts_user_date ON shifts(user_id, date);
`;

