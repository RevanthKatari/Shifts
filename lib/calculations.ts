import { Shift, PayCalculation } from '@/types';
import { format, getDay, parseISO } from 'date-fns';

const BASE_RATE = 23.28;
const DEDUCTIONS_PER_4_HOURS = {
  cppQpp: 1.57,
  employmentInsurance: 1.53,
  buildingFund: 1.00,
};

export function calculatePay(shifts: Shift[]): PayCalculation {
  let regularHours = 0;
  let saturdayHours = 0;
  let sundayHours = 0;

  shifts.forEach((shift) => {
    const date = parseISO(shift.date);
    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0) {
      // Sunday
      sundayHours += shift.hours;
    } else if (dayOfWeek === 6) {
      // Saturday
      saturdayHours += shift.hours;
    } else {
      regularHours += shift.hours;
    }
  });

  const totalHours = regularHours + saturdayHours + sundayHours;

  // Calculate gross pay
  const regularPay = regularHours * BASE_RATE;
  const saturdayPay = saturdayHours * BASE_RATE * 1.5;
  const sundayPay = sundayHours * BASE_RATE * 2.0;
  const grossPay = regularPay + saturdayPay + sundayPay;

  // Calculate deductions proportionally
  // Deductions are per 4 hours, so we calculate based on total hours
  const deductionMultiplier = totalHours / 4;
  const cppQpp = DEDUCTIONS_PER_4_HOURS.cppQpp * deductionMultiplier;
  const employmentInsurance = DEDUCTIONS_PER_4_HOURS.employmentInsurance * deductionMultiplier;
  const buildingFund = DEDUCTIONS_PER_4_HOURS.buildingFund * deductionMultiplier;
  const totalDeductions = cppQpp + employmentInsurance + buildingFund;

  const takeHomePay = grossPay - totalDeductions;

  return {
    grossPay: Math.round(grossPay * 100) / 100,
    cppQpp: Math.round(cppQpp * 100) / 100,
    employmentInsurance: Math.round(employmentInsurance * 100) / 100,
    buildingFund: Math.round(buildingFund * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    takeHomePay: Math.round(takeHomePay * 100) / 100,
    hours: totalHours,
    regularHours,
    saturdayHours,
    sundayHours,
  };
}

export function getShiftTimes(shiftType: 'morning' | 'afternoon' | 'night'): { startTime: string; endTime: string; hours: number } {
  switch (shiftType) {
    case 'morning':
      return { startTime: '06:30', endTime: '14:30', hours: 8 };
    case 'afternoon':
      return { startTime: '14:30', endTime: '22:30', hours: 8 };
    case 'night':
      return { startTime: '22:30', endTime: '06:30', hours: 8 };
    default:
      return { startTime: '06:30', endTime: '14:30', hours: 8 };
  }
}

