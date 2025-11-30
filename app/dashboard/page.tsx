'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shift } from '@/types';
import Calendar from '@/app/components/Calendar';
import ShiftForm from '@/app/components/ShiftForm';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import PayCalculator from '@/app/components/PayCalculator';
import ShiftCard from '@/app/components/ShiftCard';
import { Analytics } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'analytics' | 'pay'>('calendar');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchShifts();
      fetchAnalytics();
    }
  }, [loading]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (!response.ok) {
        router.push('/');
        return;
      }
      setLoading(false);
    } catch (error) {
      router.push('/');
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts');
      if (response.ok) {
        const data = await response.json();
        setShifts(data.shifts);
      }
    } catch (error) {
      toast.error('Failed to fetch shifts');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleDateClick = (date: Date) => {
    const existingShift = shifts.find(
      (s) => new Date(s.date).toDateString() === date.toDateString()
    );
    if (existingShift) {
      setEditingShift(existingShift);
    } else {
      setEditingShift(null);
      setSelectedDate(date);
    }
    setShowForm(true);
  };

  const handleShiftSave = () => {
    fetchShifts();
    fetchAnalytics();
    setShowForm(false);
    setEditingShift(null);
    setSelectedDate(null);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(new Date(shift.date));
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text">
              Shift Tracker
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white rounded-xl hover:bg-white dark:hover:bg-gray-700 font-semibold transition-all duration-200 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            Logout
          </button>
        </div>

        {/* Tabs - Mobile optimized */}
        <div className="flex gap-2 mb-6 glass rounded-2xl p-1.5 sm:p-2 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 whitespace-nowrap
              ${activeTab === 'calendar'
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 whitespace-nowrap
              ${activeTab === 'list'
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            📋 Shifts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 whitespace-nowrap
              ${activeTab === 'analytics'
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('pay')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 whitespace-nowrap
              ${activeTab === 'pay'
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            💰 Pay
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className={activeTab === 'calendar' ? 'lg:col-span-2' : activeTab === 'list' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {activeTab === 'calendar' && (
              <Calendar
                shifts={shifts}
                onDateClick={handleDateClick}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'list' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">All Shifts</h2>
                  <button
                    onClick={() => {
                      setEditingShift(null);
                      setSelectedDate(new Date());
                      setShowForm(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    + Add Shift
                  </button>
                </div>
                <div className="space-y-3">
                  {shifts.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-white/20 dark:border-gray-700/50">
                      <div className="text-6xl mb-4">📅</div>
                      <div className="text-gray-600 dark:text-gray-400 font-medium">
                        No shifts recorded yet. Click "Add Shift" to get started!
                      </div>
                    </div>
                  ) : (
                    shifts.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} onEdit={handleEditShift} />
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'analytics' && analytics && (
              <AnalyticsDashboard analytics={analytics} />
            )}
            {activeTab === 'pay' && <PayCalculator shifts={shifts} />}
          </div>

          {activeTab === 'calendar' && (
            <div>
              {showForm ? (
                <ShiftForm
                  shift={editingShift}
                  selectedDate={selectedDate}
                  onSave={handleShiftSave}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingShift(null);
                    setSelectedDate(null);
                  }}
                />
              ) : (
                <div className="glass rounded-2xl shadow-xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                  </h3>
                  <button
                    onClick={() => {
                      setEditingShift(null);
                      setSelectedDate(new Date());
                      setShowForm(true);
                    }}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6"
                  >
                    + Add New Shift
                  </button>
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Recent Shifts
                    </div>
                    {shifts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                        No shifts yet
                      </div>
                    ) : (
                      shifts.slice(0, 5).map((shift) => (
                        <ShiftCard key={shift.id} shift={shift} onEdit={handleEditShift} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
