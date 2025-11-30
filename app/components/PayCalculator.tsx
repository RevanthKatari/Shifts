'use client';

import { useState, useEffect } from 'react';
import { PayCalculation } from '@/types';
import { calculatePay } from '@/lib/calculations';
import { Shift } from '@/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

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
      <div className="glass rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50">
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No shifts to calculate</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl shadow-xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Pay Calculator</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'all' | 'week' | 'month')}
          className="px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white font-semibold transition-all"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Gross Pay */}
        <div className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm sm:text-base opacity-90 font-medium">Gross Pay</div>
            <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl sm:text-5xl font-extrabold">${calculation.grossPay.toFixed(2)}</div>
        </div>

        {/* Hours Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-semibold mb-1">Regular Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-100">
              {calculation.regularHours.toFixed(1)}h
            </div>
          </div>
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
            <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-semibold mb-1">Saturday Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-900 dark:text-purple-100">
              {calculation.saturdayHours.toFixed(1)}h
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">1.5x rate</div>
          </div>
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800">
            <div className="text-xs sm:text-sm text-pink-700 dark:text-pink-300 font-semibold mb-1">Sunday Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-pink-900 dark:text-pink-100">
              {calculation.sundayHours.toFixed(1)}h
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400 mt-1">2x rate</div>
          </div>
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600">
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">Total Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {calculation.hours.toFixed(1)}h
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="glass rounded-xl p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Deductions
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700/50">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">CPP/QPP</span>
              <span className="font-bold text-gray-800 dark:text-white">${calculation.cppQpp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700/50">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Employment Insurance</span>
              <span className="font-bold text-gray-800 dark:text-white">${calculation.employmentInsurance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700/50">
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Building Fund</span>
              <span className="font-bold text-gray-800 dark:text-white">${calculation.buildingFund.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 mt-4">
              <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-white">Total Deductions</span>
              <span className="font-extrabold text-lg sm:text-xl text-red-600 dark:text-red-400">${calculation.totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Take Home Pay */}
        <div className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm sm:text-base opacity-90 font-medium">Take Home Pay</div>
            <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl sm:text-5xl font-extrabold">${calculation.takeHomePay.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
