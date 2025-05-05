
// Utility functions and constants for day-of-week handling
import { DayOption } from './types';

export const daysOfWeek = [
  "Sunday",
  "Monday", 
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday"
];

export function getDayOptions(): DayOption[] {
  return daysOfWeek.map((dayName, index) => ({
    dayOfWeek: index,
    dayName
  }));
}

export function getDayName(dayIndex: number): string {
  return daysOfWeek[dayIndex] || "Unknown";
}
