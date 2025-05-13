
import { UserAvailability } from '@/services/availability/types';
import { DayAvailability } from './types';
import { daysOfWeek } from './dayUtils';

export function transformAvailabilityData(availabilitySlots: UserAvailability[]): DayAvailability[] {
  // Create an array of days with empty slots arrays
  const dailyAvailability: DayAvailability[] = daysOfWeek.map((dayName, index) => ({
    dayOfWeek: index,
    dayName,
    slots: []
  }));

  console.log("transformAvailabilityData input:", availabilitySlots?.length || 0, "slots");

  // Group slots by day of week
  if (availabilitySlots && Array.isArray(availabilitySlots) && availabilitySlots.length > 0) {
    availabilitySlots.forEach(slot => {
      // Debug logging
      console.log("Processing slot:", slot);
      
      if (slot && typeof slot.dayOfWeek === 'number') {
        const dayIndex = slot.dayOfWeek;
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyAvailability[dayIndex].slots.push(slot);
        } else {
          console.error(`Invalid day index: ${dayIndex}`, slot);
        }
      } else {
        console.error('Invalid slot data:', slot, 'dayOfWeek:', slot?.dayOfWeek);
      }
    });
  }
  
  // Debug log the result
  dailyAvailability.forEach(day => {
    console.log(`${day.dayName}: ${day.slots.length} slots`);
  });
  
  return dailyAvailability;
}
