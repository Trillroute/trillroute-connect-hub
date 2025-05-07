
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

  // Group slots by day of week and log any invalid data
  if (availabilitySlots && Array.isArray(availabilitySlots) && availabilitySlots.length > 0) {
    availabilitySlots.forEach(slot => {
      // Validate slot data before processing
      if (!slot || typeof slot.dayOfWeek !== 'number') {
        console.error('Invalid slot data:', slot);
        return;
      }
      
      const dayIndex = slot.dayOfWeek;
      if (dayIndex >= 0 && dayIndex < 7) {
        dailyAvailability[dayIndex].slots.push(slot);
      } else {
        console.error(`Invalid day index: ${dayIndex}`, slot);
      }
    });
  } else {
    console.warn('No availability slots found to transform or data is not in expected format:', availabilitySlots);
  }

  // Log the resulting structure for debugging
  console.log('Transformed to daily availability structure:', 
    dailyAvailability.map(day => ({
      day: day.dayName, 
      slotCount: day.slots.length,
      slots: day.slots.length > 0 ? day.slots : 'No slots'
    }))
  );
  
  return dailyAvailability;
}
