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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shift Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Shifts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('pay')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'pay'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Pay
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Shifts</h2>
                  <button
                    onClick={() => {
                      setEditingShift(null);
                      setSelectedDate(new Date());
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    + Add Shift
                  </button>
                </div>
                <div className="space-y-3">
                  {shifts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No shifts recorded yet. Click "Add Shift" to get started!
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <button
                    onClick={() => {
                      setEditingShift(null);
                      setSelectedDate(new Date());
                      setShowForm(true);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    + Add New Shift
                  </button>
                  <div className="mt-6 space-y-2">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recent Shifts
                    </div>
                    {shifts.slice(0, 5).map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} onEdit={handleEditShift} />
                    ))}
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

