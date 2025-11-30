'use client';

import { Shift } from '@/types';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
}

export default function ShiftCard({ shift, onEdit }: ShiftCardProps) {
  const getShiftColor = (shiftType: string): string => {
    switch (shiftType) {
      case 'morning':
        return 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'afternoon':
        return 'border-l-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'night':
        return 'border-l-indigo-400 bg-indigo-50 dark:bg-indigo-900/20';
      default:
        return 'border-l-gray-400 bg-gray-50 dark:bg-gray-700';
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

  return (
    <div
      className={`border-l-4 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getShiftColor(shift.shiftType)}`}
      onClick={() => onEdit(shift)}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {format(new Date(shift.date), 'MMM d, yyyy')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {getShiftLabel(shift.shiftType)} • {shift.startTime} - {shift.endTime}
          </div>
        </div>
        <div className="text-lg font-bold text-gray-800 dark:text-white">
          {shift.hours}h
        </div>
      </div>
    </div>
  );
}

