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
    { 
      value: 'morning', 
      label: 'Morning', 
      time: '6:30 AM - 2:30 PM', 
      bg: 'bg-[#fff4e6] dark:bg-[#3d2e1f]',
      border: 'border-[#f2d675] dark:border-[#8b6914]',
      text: 'text-[#8b6914] dark:text-[#f2d675]',
    },
    { 
      value: 'afternoon', 
      label: 'Afternoon', 
      time: '2:30 PM - 10:30 PM', 
      bg: 'bg-[#ffe5e5] dark:bg-[#3d1f1f]',
      border: 'border-[#ff9999] dark:border-[#b85450]',
      text: 'text-[#b85450] dark:text-[#ff9999]',
    },
    { 
      value: 'night', 
      label: 'Night', 
      time: '10:30 PM - 6:30 AM', 
      bg: 'bg-[#e1f5ff] dark:bg-[#1f2e3d]',
      border: 'border-[#6cc4e8] dark:border-[#0b6e99]',
      text: 'text-[#0b6e99] dark:text-[#6cc4e8]',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="notion-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#37352f] dark:bg-[#e9e9e7] flex items-center justify-center">
          <svg className="w-5 h-5 text-white dark:text-[#191919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6H6m6 0h6" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#37352f] dark:text-[#e9e9e7]">
          {shift ? 'Edit Shift' : 'Add New Shift'}
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#37352f] dark:text-[#e9e9e7]">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="notion-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#37352f] dark:focus:ring-[#e9e9e7] focus:ring-offset-0 font-medium"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#37352f] dark:text-[#e9e9e7]">
          Shift Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {shiftTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setShiftType(option.value as ShiftType)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-150 text-left
                ${shiftType === option.value
                  ? `${option.bg} ${option.border} ${option.text} border-2 shadow-sm`
                  : 'notion-card notion-hover border-[#e9e9e7] dark:border-[#2e2e2e] text-[#37352f] dark:text-[#e9e9e7]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm sm:text-base">{option.label}</div>
                  <div className={`text-xs mt-1 ${shiftType === option.value ? option.text : 'text-[#787774] dark:text-[#9b9a97]'}`}>
                    {option.time}
                  </div>
                </div>
                {shiftType === option.value && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="notion-badge rounded-lg p-4">
        <div className="text-sm font-semibold text-[#37352f] dark:text-[#e9e9e7] mb-2">Shift Details</div>
        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-[#787774] dark:text-[#9b9a97]">Start</div>
            <div className="font-bold text-[#37352f] dark:text-[#e9e9e7]">{times.startTime}</div>
          </div>
          <div>
            <div className="text-[#787774] dark:text-[#9b9a97]">End</div>
            <div className="font-bold text-[#37352f] dark:text-[#e9e9e7]">{times.endTime}</div>
          </div>
          <div>
            <div className="text-[#787774] dark:text-[#9b9a97]">Hours</div>
            <div className="font-bold text-[#37352f] dark:text-[#e9e9e7]">{times.hours}h</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="notion-button-primary flex-1 py-3 px-6 rounded-lg font-semibold disabled:opacity-50 transition-all duration-150"
        >
          {loading ? 'Saving...' : shift ? 'Update Shift' : 'Add Shift'}
        </button>
        {shift && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="py-3 px-6 bg-[#b85450] hover:bg-[#a8423e] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b85450]/50 disabled:opacity-50 transition-all duration-150"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="notion-button py-3 px-6 rounded-lg font-semibold disabled:opacity-50 transition-all duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
