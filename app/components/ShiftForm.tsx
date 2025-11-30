'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Shift, ShiftType } from '@/types';
import { getShiftTimes } from '@/lib/calculations';
import toast from 'react-hot-toast';

interface ShiftFormProps {
  shift?: Shift | null;
  selectedDate?: Date | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ShiftForm({ shift, selectedDate, onSave, onCancel }: ShiftFormProps) {
  const [date, setDate] = useState(
    shift?.date || (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
  );
  const [shiftType, setShiftType] = useState<ShiftType>(shift?.shiftType || 'morning');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shift) {
      setDate(shift.date);
      setShiftType(shift.shiftType);
    } else if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [shift, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const times = getShiftTimes(shiftType);

    try {
      const url = shift ? `/api/shifts/${shift.id}` : '/api/shifts';
      const method = shift ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          shiftType,
          startTime: times.startTime,
          endTime: times.endTime,
          hours: times.hours,
        }),
      });

      if (response.ok) {
        toast.success(shift ? 'Shift updated!' : 'Shift added!');
        onSave();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save shift');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shift || !confirm('Are you sure you want to delete this shift?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/shifts?id=${shift.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Shift deleted!');
        onSave();
      } else {
        toast.error('Failed to delete shift');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const times = getShiftTimes(shiftType);

  const shiftTypeOptions = [
    { value: 'morning', label: 'Morning', time: '6:30 AM - 2:30 PM', color: 'from-yellow-400 to-yellow-500' },
    { value: 'afternoon', label: 'Afternoon', time: '2:30 PM - 10:30 PM', color: 'from-orange-400 to-orange-500' },
    { value: 'night', label: 'Night', time: '10:30 PM - 6:30 AM', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl shadow-xl p-5 sm:p-6 space-y-5 border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6H6m6 0h6" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {shift ? 'Edit Shift' : 'Add New Shift'}
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all duration-200 font-medium"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Shift Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {shiftTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setShiftType(option.value as ShiftType)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${shiftType === option.value
                  ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg scale-[1.02]`
                  : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm sm:text-base">{option.label}</div>
                  <div className={`text-xs mt-1 ${shiftType === option.value ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    {option.time}
                  </div>
                </div>
                {shiftType === option.value && (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Shift Details</div>
        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Start</div>
            <div className="font-bold text-gray-800 dark:text-white">{times.startTime}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">End</div>
            <div className="font-bold text-gray-800 dark:text-white">{times.endTime}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Hours</div>
            <div className="font-bold text-gray-800 dark:text-white">{times.hours}h</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            shift ? 'Update Shift' : 'Add Shift'
          )}
        </button>
        {shift && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-500/50 disabled:opacity-50 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
