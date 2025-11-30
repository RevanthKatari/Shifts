export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface Shift {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  shiftType: ShiftType;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  hours: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayCalculation {
  grossPay: number;
  cppQpp: number;
  employmentInsurance: number;
  buildingFund: number;
  totalDeductions: number;
  takeHomePay: number;
  hours: number;
  regularHours: number;
  saturdayHours: number;
  sundayHours: number;
}

export interface Analytics {
  totalHours: number;
  totalShifts: number;
  shiftsByType: {
    morning: number;
    afternoon: number;
    night: number;
  };
  weeklyHours: number;
  monthlyHours: number;
  hoursByWeek: Array<{ week: string; hours: number }>;
  hoursByMonth: Array<{ month: string; hours: number }>;
}

