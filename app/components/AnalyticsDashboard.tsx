'use client';

import { Analytics } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass rounded-2xl shadow-xl p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm opacity-90 font-medium">Total Hours</div>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold">{analytics.totalHours.toFixed(1)}</div>
        </div>
        
        <div className="glass rounded-2xl shadow-xl p-4 sm:p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm opacity-90 font-medium">Total Shifts</div>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold">{analytics.totalShifts}</div>
        </div>
        
        <div className="glass rounded-2xl shadow-xl p-4 sm:p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm opacity-90 font-medium">This Week</div>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold">{analytics.weeklyHours.toFixed(1)}</div>
        </div>
        
        <div className="glass rounded-2xl shadow-xl p-4 sm:p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm opacity-90 font-medium">This Month</div>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold">{analytics.monthlyHours.toFixed(1)}</div>
        </div>
      </div>

      {/* Charts and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Shifts by Type */}
        <div className="glass rounded-2xl shadow-xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Shifts by Type
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md"></div>
                <span className="font-semibold text-gray-800 dark:text-white">Morning</span>
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-white">{analytics.shiftsByType.morning}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md"></div>
                <span className="font-semibold text-gray-800 dark:text-white">Afternoon</span>
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-white">{analytics.shiftsByType.afternoon}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md"></div>
                <span className="font-semibold text-gray-800 dark:text-white">Night</span>
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-white">{analytics.shiftsByType.night}</span>
            </div>
          </div>
        </div>

        {/* Hours by Week */}
        <div className="glass rounded-2xl shadow-xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Hours by Week
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.hoursByWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Bar dataKey="hours" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hours by Month */}
        <div className="glass rounded-2xl shadow-xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Hours by Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.hoursByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="url(#lineGradient)" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
