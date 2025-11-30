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
      <div className="notion-card p-6">
        <p className="text-[#787774] dark:text-[#9b9a97] text-center py-8">No shifts to calculate</p>
      </div>
    );
  }

  return (
    <div className="notion-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#37352f] dark:bg-[#e9e9e7] flex items-center justify-center">
            <svg className="w-5 h-5 text-white dark:text-[#191919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#37352f] dark:text-[#e9e9e7]">Pay Calculator</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'all' | 'week' | 'month')}
          className="notion-input px-4 py-2.5 rounded-lg font-semibold transition-all text-[#37352f] dark:text-[#e9e9e7] [&>option]:bg-white [&>option]:dark:bg-[#1e1e1e] [&>option]:text-[#37352f] [&>option]:dark:text-[#e9e9e7]"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Gross Pay */}
        <div className="p-6 sm:p-8 rounded-lg border border-[#e9e9e7] dark:border-[#2e2e2e] bg-[#37352f] dark:bg-[#e9e9e7] transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm sm:text-base text-white dark:text-[#191919] font-medium opacity-90">Gross Pay</div>
            <svg className="w-6 h-6 text-white dark:text-[#191919] opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl sm:text-5xl font-extrabold text-white dark:text-[#191919] transition-colors duration-200">${calculation.grossPay.toFixed(2)}</div>
        </div>

        {/* Hours Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="notion-badge rounded-lg p-4">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-semibold mb-1">Regular Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">
              {calculation.regularHours.toFixed(1)}h
            </div>
          </div>
          <div className="notion-badge rounded-lg p-4">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-semibold mb-1">Saturday Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">
              {calculation.saturdayHours.toFixed(1)}h
            </div>
            <div className="text-xs text-[#787774] dark:text-[#9b9a97] mt-1">1.5x rate</div>
          </div>
          <div className="notion-badge rounded-lg p-4">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-semibold mb-1">Sunday Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">
              {calculation.sundayHours.toFixed(1)}h
            </div>
            <div className="text-xs text-[#787774] dark:text-[#9b9a97] mt-1">2x rate</div>
          </div>
          <div className="notion-badge rounded-lg p-4">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-semibold mb-1">Total Hours</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">
              {calculation.hours.toFixed(1)}h
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="notion-card rounded-lg p-5 sm:p-6">
          <h4 className="font-bold text-lg text-[#37352f] dark:text-[#e9e9e7] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#b85450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Deductions
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg notion-badge">
              <span className="text-sm sm:text-base text-[#37352f] dark:text-[#e9e9e7] font-medium">CPP/QPP</span>
              <span className="font-bold text-[#37352f] dark:text-[#e9e9e7]">${calculation.cppQpp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg notion-badge">
              <span className="text-sm sm:text-base text-[#37352f] dark:text-[#e9e9e7] font-medium">Employment Insurance</span>
              <span className="font-bold text-[#37352f] dark:text-[#e9e9e7]">${calculation.employmentInsurance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg notion-badge">
              <span className="text-sm sm:text-base text-[#37352f] dark:text-[#e9e9e7] font-medium">Building Fund</span>
              <span className="font-bold text-[#37352f] dark:text-[#e9e9e7]">${calculation.buildingFund.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#ffe5e5] dark:bg-[#3d1f1f] border border-[#ff9999] dark:border-[#b85450] mt-4">
              <span className="font-bold text-base sm:text-lg text-[#b85450] dark:text-[#ff9999]">Total Deductions</span>
              <span className="font-extrabold text-lg sm:text-xl text-[#b85450] dark:text-[#ff9999]">${calculation.totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Take Home Pay */}
        <div className="p-6 sm:p-8 rounded-lg border border-[#e9e9e7] dark:border-[#2e2e2e] bg-[#37352f] dark:bg-[#e9e9e7] transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm sm:text-base text-white dark:text-[#191919] font-medium opacity-90">Take Home Pay</div>
            <svg className="w-6 h-6 text-white dark:text-[#191919] opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl sm:text-5xl font-extrabold text-white dark:text-[#191919] transition-colors duration-200">${calculation.takeHomePay.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
