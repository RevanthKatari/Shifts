'use client';

import { Shift } from '@/types';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
}

export default function ShiftCard({ shift, onEdit }: ShiftCardProps) {
  const getShiftConfig = (shiftType: string) => {
    switch (shiftType) {
      case 'morning':
        return {
          bg: 'bg-[#fff4e6] dark:bg-[#3d2e1f]',
          border: 'border-[#f2d675] dark:border-[#8b6914]',
          text: 'text-[#8b6914] dark:text-[#f2d675]',
          icon: '🌅',
        };
      case 'afternoon':
        return {
          bg: 'bg-[#ffe5e5] dark:bg-[#3d1f1f]',
          border: 'border-[#ff9999] dark:border-[#b85450]',
          text: 'text-[#b85450] dark:text-[#ff9999]',
          icon: '☀️',
        };
      case 'night':
        return {
          bg: 'bg-[#e1f5ff] dark:bg-[#1f2e3d]',
          border: 'border-[#6cc4e8] dark:border-[#0b6e99]',
          text: 'text-[#0b6e99] dark:text-[#6cc4e8]',
          icon: '🌙',
        };
      default:
        return {
          bg: 'bg-[#f7f6f3] dark:bg-[#2a2a2a]',
          border: 'border-[#e9e9e7] dark:border-[#2e2e2e]',
          text: 'text-[#37352f] dark:text-[#e9e9e7]',
          icon: '📅',
        };
    }
  };

  const getShiftLabel = (shiftType: string): string => {
    switch (shiftType) {
      case 'morning':
        return 'Morning';
      case 'afternoon':
        return 'Afternoon';
      case 'night':
        return 'Night';
      default:
        return shiftType;
    }
  };

  const config = getShiftConfig(shift.shiftType);

  return (
    <div
      className={`
        notion-card notion-hover p-4 sm:p-5 cursor-pointer border-l-4 ${config.border}
        ${config.bg}
      `}
      onClick={() => onEdit(shift)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`
            w-12 h-12 rounded-lg ${config.bg} border ${config.border}
            flex items-center justify-center text-2xl flex-shrink-0
          `}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base sm:text-lg text-[#37352f] dark:text-[#e9e9e7] truncate">
              {format(new Date(shift.date), 'MMM d, yyyy')}
            </div>
            <div className={`text-xs sm:text-sm mt-1 flex items-center gap-2 ${config.text} font-medium`}>
              <span>{getShiftLabel(shift.shiftType)}</span>
              <span>•</span>
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className={`
            px-4 py-2 rounded-lg ${config.bg} border ${config.border}
            ${config.text} font-bold text-lg sm:text-xl
          `}>
            {shift.hours}h
          </div>
        </div>
      </div>
    </div>
  );
}
