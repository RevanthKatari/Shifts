'use client';

import { Analytics } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Hours</div>
          <div className="text-3xl font-bold">{analytics.totalHours.toFixed(1)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Shifts</div>
          <div className="text-3xl font-bold">{analytics.totalShifts}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">This Week</div>
          <div className="text-3xl font-bold">{analytics.weeklyHours.toFixed(1)}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">This Month</div>
          <div className="text-3xl font-bold">{analytics.monthlyHours.toFixed(1)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shifts by Type</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Morning</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">{analytics.shiftsByType.morning}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Afternoon</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">{analytics.shiftsByType.afternoon}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-400 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Night</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">{analytics.shiftsByType.night}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hours by Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.hoursByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hours by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.hoursByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

