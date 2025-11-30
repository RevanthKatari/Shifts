'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shift } from '@/types';
import Calendar from '@/app/components/Calendar';
import ShiftForm from '@/app/components/ShiftForm';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import PayCalculator from '@/app/components/PayCalculator';
import ShiftCard from '@/app/components/ShiftCard';
import ThemeToggle from '@/app/components/ThemeToggle';
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#37352f] dark:border-[#e9e9e7] border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-[#37352f] dark:text-[#e9e9e7]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#37352f] dark:bg-[#e9e9e7] flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-[#191919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#37352f] dark:text-[#e9e9e7]">
              Shift Tracker
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="notion-button px-4 py-2.5 rounded-lg font-semibold transition-all duration-150"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 notion-card p-1.5 sm:p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-150 whitespace-nowrap
              ${activeTab === 'calendar'
                ? 'notion-button-primary text-white dark:text-[#191919]'
                : 'notion-button text-[#37352f] dark:text-[#e9e9e7]'
              }
            `}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-150 whitespace-nowrap
              ${activeTab === 'list'
                ? 'notion-button-primary text-white dark:text-[#191919]'
                : 'notion-button text-[#37352f] dark:text-[#e9e9e7]'
              }
            `}
          >
            📋 Shifts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-150 whitespace-nowrap
              ${activeTab === 'analytics'
                ? 'notion-button-primary text-white dark:text-[#191919]'
                : 'notion-button text-[#37352f] dark:text-[#e9e9e7]'
              }
            `}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('pay')}
            className={`
              flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-150 whitespace-nowrap
              ${activeTab === 'pay'
                ? 'notion-button-primary text-white dark:text-[#191919]'
                : 'notion-button text-[#37352f] dark:text-[#e9e9e7]'
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#37352f] dark:text-[#e9e9e7]">All Shifts</h2>
                  <button
                    onClick={() => {
                      setEditingShift(null);
                      setSelectedDate(new Date());
                      setShowForm(true);
                    }}
                    className="notion-button-primary w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-150"
                  >
                    + Add Shift
                  </button>
                </div>
                <div className="space-y-3">
                  {shifts.length === 0 ? (
                    <div className="notion-card p-12 text-center">
                      <div className="text-6xl mb-4">📅</div>
                      <div className="text-[#787774] dark:text-[#9b9a97] font-medium">
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
                <div className="notion-card p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#37352f] dark:text-[#e9e9e7] mb-4 sm:mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#787774] dark:text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="notion-button-primary w-full py-3.5 px-6 rounded-lg font-semibold transition-all duration-150 mb-6"
                  >
                    + Add New Shift
                  </button>
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-[#37352f] dark:text-[#e9e9e7] mb-3">
                      Recent Shifts
                    </div>
                    {shifts.length === 0 ? (
                      <div className="text-center py-8 text-[#787774] dark:text-[#9b9a97] text-sm">
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
