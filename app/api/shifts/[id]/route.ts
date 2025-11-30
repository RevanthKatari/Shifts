import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/db';
import { Shift } from '@/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseClient();
    const body = await request.json();
    const { date, shiftType, startTime, endTime, hours } = body;

    const { data, error } = await supabase
      .from('shifts')
      .update({
        date,
        shift_type: shiftType,
        start_time: startTime,
        end_time: endTime,
        hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    const shift: Shift = {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      shiftType: data.shift_type,
      startTime: data.start_time,
      endTime: data.end_time,
      hours: parseFloat(data.hours),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ shift });
  } catch (error: any) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

