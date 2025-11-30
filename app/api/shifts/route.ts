import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/db';
import { Shift } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('shift_type', { ascending: true });

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const shifts: Shift[] = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      date: row.date,
      shiftType: row.shift_type,
      startTime: row.start_time,
      endTime: row.end_time,
      hours: parseFloat(row.hours),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ shifts });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseClient();
    const body = await request.json();
    const { date, shiftType, startTime, endTime, hours } = body;

    // Check for duplicate shift on same date and type
    const { data: existing } = await supabase
      .from('shifts')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date)
      .eq('shift_type', shiftType)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Shift already exists for this date and type' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        user_id: userId,
        date,
        shift_type: shiftType,
        start_time: startTime,
        end_time: endTime,
        hours,
      })
      .select()
      .single();

    if (error) {
      throw error;
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

    return NextResponse.json({ shift }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Shift ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

