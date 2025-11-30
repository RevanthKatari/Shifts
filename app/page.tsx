'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast.error('Please enter your secret code');
      return;
    }

    if (code !== '2338' && code !== '2339') {
      toast.error('Invalid secret code');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#191919] px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="notion-card p-8 sm:p-10 space-y-8">
          {/* Logo/Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[#37352f] dark:bg-[#e9e9e7] mb-2">
              <svg className="w-7 h-7 text-white dark:text-[#191919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#37352f] dark:text-[#e9e9e7]">
              Shift Tracker
            </h1>
            <p className="text-sm text-[#787774] dark:text-[#9b9a97]">
              Enter your secret code to access your dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-semibold text-[#37352f] dark:text-[#e9e9e7]">
                Secret Code
              </label>
              <div className="relative">
                <input
                  id="code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="notion-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#37352f] dark:focus:ring-[#e9e9e7] focus:ring-offset-0 placeholder:text-[#9b9a97] dark:placeholder:text-[#787774] font-medium text-[#37352f] dark:text-[#e9e9e7]"
                  placeholder="Enter your code"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-[#9b9a97] dark:text-[#787774]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="notion-button-primary w-full py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
