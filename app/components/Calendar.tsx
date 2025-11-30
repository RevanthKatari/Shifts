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

  const getShiftStyle = (shiftType: string): string => {
    switch (shiftType) {
      case 'morning':
        return 'bg-[#fff4e6] dark:bg-[#3d2e1f] text-[#8b6914] dark:text-[#f2d675] border-[#f2d675] dark:border-[#8b6914]';
      case 'afternoon':
        return 'bg-[#ffe5e5] dark:bg-[#3d1f1f] text-[#b85450] dark:text-[#ff9999] border-[#ff9999] dark:border-[#b85450]';
      case 'night':
        return 'bg-[#e1f5ff] dark:bg-[#1f2e3d] text-[#0b6e99] dark:text-[#6cc4e8] border-[#6cc4e8] dark:border-[#0b6e99]';
      default:
        return '';
    }
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const firstDayOfWeek = getDay(monthStart);
  const offsetDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div className="notion-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="notion-button p-2 rounded-lg transition-all duration-150"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-[#37352f] dark:text-[#e9e9e7]">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="notion-button p-2 rounded-lg transition-all duration-150"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-[#787774] dark:text-[#9b9a97] py-2 sm:py-3">
            {day}
          </div>
        ))}

        {Array.from({ length: offsetDays }).map((_, i) => (
          <div key={`offset-${i}`} className="h-12 sm:h-16" />
        ))}

        {daysInMonth.map((day) => {
          const shift = getShiftForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`
                h-12 sm:h-16 p-1 sm:p-1.5 rounded-lg border-2 transition-all duration-150 text-left
                ${isSelected ? 'border-[#37352f] dark:border-[#e9e9e7] ring-2 ring-[#37352f]/20 dark:ring-[#e9e9e7]/20' : 'border-transparent'}
                ${isToday && !shift ? 'bg-[#f7f6f3] dark:bg-[#2a2a2a] border-[#e9e9e7] dark:border-[#2e2e2e]' : ''}
                ${shift ? getShiftStyle(shift.shiftType) + ' border-2 font-semibold' : 'notion-hover text-[#37352f] dark:text-[#e9e9e7]'}
                ${!shift && !isToday ? 'hover:border-[#e9e9e7] dark:hover:border-[#2e2e2e]' : ''}
              `}
            >
              <div className={`text-xs sm:text-sm font-semibold ${shift ? '' : 'text-[#37352f] dark:text-[#e9e9e7]'}`}>
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
