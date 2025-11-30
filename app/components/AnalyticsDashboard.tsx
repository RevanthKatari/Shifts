'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const gridColor = isDark ? '#2e2e2e' : '#e9e9e7';
  const axisColor = isDark ? '#9b9a97' : '#787774';
  const barColor = isDark ? '#e9e9e7' : '#37352f';
  const lineColor = isDark ? '#e9e9e7' : '#37352f';
  const tooltipBg = isDark ? '#1e1e1e' : '#ffffff';
  const tooltipBorder = isDark ? '#2e2e2e' : '#e9e9e7';
  const tooltipColor = isDark ? '#e9e9e7' : '#37352f';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="notion-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-medium">Total Hours</div>
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">{analytics.totalHours.toFixed(1)}</div>
        </div>
        
        <div className="notion-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-medium">Total Shifts</div>
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">{analytics.totalShifts}</div>
        </div>
        
        <div className="notion-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-medium">This Week</div>
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">{analytics.weeklyHours.toFixed(1)}</div>
        </div>
        
        <div className="notion-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] font-medium">This Month</div>
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">{analytics.monthlyHours.toFixed(1)}</div>
        </div>
      </div>

      {/* Charts and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Shifts by Type */}
        <div className="notion-card p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-[#37352f] dark:text-[#e9e9e7] mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Shifts by Type
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#fff4e6] dark:bg-[#3d2e1f] border border-[#f2d675] dark:border-[#8b6914]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#f2d675] dark:bg-[#8b6914]"></div>
                <span className="font-semibold text-[#8b6914] dark:text-[#f2d675]">Morning</span>
              </div>
              <span className="font-bold text-lg text-[#8b6914] dark:text-[#f2d675]">{analytics.shiftsByType.morning}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#ffe5e5] dark:bg-[#3d1f1f] border border-[#ff9999] dark:border-[#b85450]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#ff9999] dark:bg-[#b85450]"></div>
                <span className="font-semibold text-[#b85450] dark:text-[#ff9999]">Afternoon</span>
              </div>
              <span className="font-bold text-lg text-[#b85450] dark:text-[#ff9999]">{analytics.shiftsByType.afternoon}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#e1f5ff] dark:bg-[#1f2e3d] border border-[#6cc4e8] dark:border-[#0b6e99]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#6cc4e8] dark:bg-[#0b6e99]"></div>
                <span className="font-semibold text-[#0b6e99] dark:text-[#6cc4e8]">Night</span>
              </div>
              <span className="font-bold text-lg text-[#0b6e99] dark:text-[#6cc4e8]">{analytics.shiftsByType.night}</span>
            </div>
          </div>
        </div>

        {/* Hours by Week */}
        <div className="notion-card p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-[#37352f] dark:text-[#e9e9e7] mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Hours by Week
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.hoursByWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis dataKey="week" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  padding: '8px',
                  color: tooltipColor,
                }}
              />
              <Bar dataKey="hours" fill={barColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hours by Month */}
        <div className="notion-card p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-[#37352f] dark:text-[#e9e9e7] mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Hours by Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.hoursByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  padding: '8px',
                  color: tooltipColor,
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke={lineColor} 
                strokeWidth={3}
                dot={{ fill: lineColor, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
