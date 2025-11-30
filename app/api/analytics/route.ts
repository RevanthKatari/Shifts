import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/db';
import { Analytics } from '@/types';
import { startOfWeek, startOfMonth, subWeeks, subMonths, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    const allShifts = (data || []).map((row: any) => ({
      date: row.date,
      shiftType: row.shift_type,
      hours: parseFloat(row.hours),
    }));

    // Calculate totals
    const totalHours = allShifts.reduce((sum, shift) => sum + shift.hours, 0);
    const totalShifts = allShifts.length;

    // Shifts by type
    const shiftsByType = {
      morning: allShifts.filter((s) => s.shiftType === 'morning').length,
      afternoon: allShifts.filter((s) => s.shiftType === 'afternoon').length,
      night: allShifts.filter((s) => s.shiftType === 'night').length,
    };

    // Weekly hours (last 8 weeks)
    const now = new Date();
    const hoursByWeek: Array<{ week: string; hours: number }> = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekShifts = allShifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= weekStart && shiftDate <= weekEnd;
      });
      
      const weekHours = weekShifts.reduce((sum, shift) => sum + shift.hours, 0);
      hoursByWeek.push({
        week: format(weekStart, 'MMM d'),
        hours: weekHours,
      });
    }

    // Monthly hours (last 6 months)
    const hoursByMonth: Array<{ month: string; hours: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthShifts = allShifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= monthStart && shiftDate <= monthEnd;
      });
      
      const monthHours = monthShifts.reduce((sum, shift) => sum + shift.hours, 0);
      hoursByMonth.push({
        month: format(monthStart, 'MMM yyyy'),
        hours: monthHours,
      });
    }

    // Current week and month
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    const weeklyHours = allShifts
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= currentWeekStart && shiftDate <= currentWeekEnd;
      })
      .reduce((sum, shift) => sum + shift.hours, 0);

    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0);
    const monthlyHours = allShifts
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= currentMonthStart && shiftDate <= currentMonthEnd;
      })
      .reduce((sum, shift) => sum + shift.hours, 0);

    const analytics: Analytics = {
      totalHours,
      totalShifts,
      shiftsByType,
      weeklyHours,
      monthlyHours,
      hoursByWeek,
      hoursByMonth,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

