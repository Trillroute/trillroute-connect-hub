
import { daysOfWeek } from './dayUtils';
import { UserAvailability } from '@/services/userAvailabilityService';
import { DayAvailability } from './types';

export function transformAvailabilityData(availabilityData: UserAvailability[]): DayAvailability[] {
  // Organize by day of week
  const availabilityByDay: Record<number, UserAvailability[]> = {};
  
  // Initialize all days
  for (let i = 0; i < 7; i++) {
    availabilityByDay[i] = [];
  }
  
  // Group slots by day
  availabilityData.forEach(slot => {
    if (!availabilityByDay[slot.dayOfWeek]) {
      availabilityByDay[slot.dayOfWeek] = [];
    }
    availabilityByDay[slot.dayOfWeek].push(slot);
  });
  
  // Convert to array format
  return Object.keys(availabilityByDay)
    .map(day => {
      const dayIndex = parseInt(day);
      return {
        dayOfWeek: dayIndex,
        dayName: daysOfWeek[dayIndex],
        slots: availabilityByDay[dayIndex].sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        })
      };
    })
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}
