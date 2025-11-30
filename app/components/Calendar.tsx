'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { Shift } from '@/types';

interface CalendarProps {
  shifts: Shift[];
  onDateClick: (date: Date) => void;
  selectedDate?: Date | null;
}

export default function Calendar({ shifts, onDateClick, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getShiftForDate = (date: Date): Shift | undefined => {
    return shifts.find((shift) => isSameDay(new Date(shift.date), date));
  };

  const getShiftColor = (shiftType: string): string => {
    switch (shiftType) {
      case 'morning':
        return 'bg-yellow-400 text-yellow-900';
      case 'afternoon':
        return 'bg-orange-400 text-orange-900';
      case 'night':
        return 'bg-indigo-400 text-indigo-900';
      default:
        return 'bg-gray-200';
    }
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Get first day of week offset
  const firstDayOfWeek = getDay(monthStart);
  const offsetDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday = 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}

        {/* Offset days */}
        {Array.from({ length: offsetDays }).map((_, i) => (
          <div key={`offset-${i}`} className="h-16" />
        ))}

        {/* Calendar days */}
        {daysInMonth.map((day) => {
          const shift = getShiftForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`
                h-16 p-1 rounded-lg border-2 transition-all
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}
                ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                ${shift ? getShiftColor(shift.shiftType) + ' font-semibold' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {shift && (
                <div className="text-xs mt-1 truncate">
                  {shift.shiftType.charAt(0).toUpperCase() + shift.shiftType.slice(1)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

