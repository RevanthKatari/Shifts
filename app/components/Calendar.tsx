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
        return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 font-semibold shadow-md';
      case 'afternoon':
        return 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900 font-semibold shadow-md';
      case 'night':
        return 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold shadow-md';
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
    <div className="glass rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 py-2 sm:py-3">
            {day}
          </div>
        ))}

        {/* Offset days */}
        {Array.from({ length: offsetDays }).map((_, i) => (
          <div key={`offset-${i}`} className="h-12 sm:h-16" />
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
                h-12 sm:h-16 p-1 sm:p-1.5 rounded-lg border-2 transition-all duration-200
                ${isSelected ? 'border-blue-500 ring-4 ring-blue-200/50 dark:ring-blue-500/30 scale-105' : 'border-transparent'}
                ${isToday && !shift ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''}
                ${shift ? getShiftColor(shift.shiftType) + ' hover:scale-105' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}
                ${!shift && !isToday ? 'hover:border-gray-300 dark:hover:border-gray-600' : ''}
              `}
            >
              <div className={`text-xs sm:text-sm font-semibold ${shift ? '' : 'text-gray-800 dark:text-gray-200'}`}>
                {format(day, 'd')}
              </div>
              {shift && (
                <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 truncate font-medium">
                  {shift.shiftType.charAt(0).toUpperCase() + shift.shiftType.slice(1).substring(0, 3)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
