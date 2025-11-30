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

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {shift ? 'Edit Shift' : 'Add Shift'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shift Type
        </label>
        <select
          value={shiftType}
          onChange={(e) => setShiftType(e.target.value as ShiftType)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="morning">Morning (6:30 AM - 2:30 PM)</option>
          <option value="afternoon">Afternoon (2:30 PM - 10:30 PM)</option>
          <option value="night">Night (10:30 PM - 6:30 AM)</option>
        </select>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>Start Time: {times.startTime}</div>
          <div>End Time: {times.endTime}</div>
          <div>Hours: {times.hours}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving...' : shift ? 'Update' : 'Add Shift'}
        </button>
        {shift && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

