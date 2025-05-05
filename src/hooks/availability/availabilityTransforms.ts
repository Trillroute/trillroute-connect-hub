
import { UserAvailability } from '@/services/availability/types';
import { DayAvailability } from './types';
import { daysOfWeek } from './dayUtils';

export function transformAvailabilityData(availabilitySlots: UserAvailability[]): DayAvailability[] {
  // Create a structure for every day of the week
  const weeklyAvailability: DayAvailability[] = daysOfWeek.map((dayName, index) => ({
    dayOfWeek: index,
    dayName,
    slots: []
  }));
  
  // Add slots to their corresponding days
  availabilitySlots.forEach(slot => {
    const dayIndex = slot.dayOfWeek;
    if (dayIndex >= 0 && dayIndex < 7) {
      weeklyAvailability[dayIndex].slots.push(slot);
    } else {
      console.error(`Invalid day of week in availability data: ${dayIndex}`);
    }
  });
  
  // Sort slots by start time within each day
  weeklyAvailability.forEach(day => {
    day.slots.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });
  
  return weeklyAvailability;
}
