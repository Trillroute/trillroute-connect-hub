
import { UserAvailability } from '@/services/availability/types';
import { DayAvailability } from './types';
import { daysOfWeek } from './dayUtils';

export function transformAvailabilityData(availabilitySlots: UserAvailability[]): DayAvailability[] {
  console.log('Transforming availability data from:', availabilitySlots);
  
  // Create an array of days with empty slots arrays
  const dailyAvailability: DayAvailability[] = daysOfWeek.map((dayName, index) => ({
    dayOfWeek: index,
    dayName,
    slots: []
  }));

  // Group slots by day of week
  if (availabilitySlots && availabilitySlots.length > 0) {
    availabilitySlots.forEach(slot => {
      const dayIndex = slot.dayOfWeek;
      if (dailyAvailability[dayIndex]) {
        dailyAvailability[dayIndex].slots.push(slot);
      } else {
        console.error(`Invalid day index: ${dayIndex}`);
      }
    });
  } else {
    console.warn('No availability slots found to transform');
  }

  // Log the resulting structure for debugging
  console.log('Transformed to daily availability structure:', 
    dailyAvailability.map(day => ({
      day: day.dayName, 
      slotCount: day.slots.length
    }))
  );
  
  return dailyAvailability;
}
