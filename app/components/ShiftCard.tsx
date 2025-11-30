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
          gradient: 'from-yellow-400 to-yellow-500',
          border: 'border-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: '🌅',
        };
      case 'afternoon':
        return {
          gradient: 'from-orange-400 to-orange-500',
          border: 'border-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          icon: '☀️',
        };
      case 'night':
        return {
          gradient: 'from-indigo-500 to-indigo-600',
          border: 'border-indigo-500',
          bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          icon: '🌙',
        };
      default:
        return {
          gradient: 'from-gray-400 to-gray-500',
          border: 'border-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-700',
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
        relative overflow-hidden rounded-xl border-l-4 ${config.border} ${config.bg}
        cursor-pointer card-hover p-4 sm:p-5
        group
      `}
      onClick={() => onEdit(shift)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient}
            flex items-center justify-center text-2xl shadow-lg
            flex-shrink-0
          `}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base sm:text-lg text-gray-800 dark:text-white truncate">
              {format(new Date(shift.date), 'MMM d, yyyy')}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span className="font-semibold">{getShiftLabel(shift.shiftType)}</span>
              <span>•</span>
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className={`
            px-4 py-2 rounded-xl bg-gradient-to-br ${config.gradient}
            text-white font-bold text-lg sm:text-xl shadow-lg
          `}>
            {shift.hours}h
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0
        group-hover:opacity-5 transition-opacity duration-300
      `} />
    </div>
  );
}
