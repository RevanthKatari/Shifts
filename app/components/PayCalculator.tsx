'use client';

import { useState, useEffect } from 'react';
import { PayCalculation } from '@/types';
import { calculatePay } from '@/lib/calculations';
import { Shift } from '@/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';

interface PayCalculatorProps {
  shifts: Shift[];
}

export default function PayCalculator({ shifts }: PayCalculatorProps) {
  const [period, setPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [calculation, setCalculation] = useState<PayCalculation | null>(null);

  useEffect(() => {
    let filteredShifts = shifts;

    if (period === 'week') {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      filteredShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= weekStart && shiftDate <= weekEnd;
      });
    } else if (period === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      filteredShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= monthStart && shiftDate <= monthEnd;
      });
    }

    const calc = calculatePay(filteredShifts);
    setCalculation(calc);
  }, [shifts, period]);

  if (!calculation) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">No shifts to calculate</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pay Calculator</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'all' | 'week' | 'month')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Gross Pay</div>
          <div className="text-4xl font-bold">${calculation.grossPay.toFixed(2)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Regular Hours</div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white">
              {calculation.regularHours.toFixed(1)}h
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saturday Hours</div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white">
              {calculation.saturdayHours.toFixed(1)}h (1.5x)
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sunday Hours</div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white">
              {calculation.sundayHours.toFixed(1)}h (2x)
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Hours</div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white">
              {calculation.hours.toFixed(1)}h
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>CPP/QPP</span>
              <span>${calculation.cppQpp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Employment Insurance</span>
              <span>${calculation.employmentInsurance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Building Fund</span>
              <span>${calculation.buildingFund.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total Deductions</span>
              <span>${calculation.totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Take Home Pay</div>
          <div className="text-4xl font-bold">${calculation.takeHomePay.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

