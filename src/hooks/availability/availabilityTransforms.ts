
import { UserAvailability } from '@/services/availability/types';
import { DayAvailability } from './types';
import { daysOfWeek } from './dayUtils';

export function transformAvailabilityData(availabilitySlots: UserAvailability[]): DayAvailability[] {
  console.log("Transforming availability data:", availabilitySlots);
  
  // Create a structure for every day of the week
  const weeklyAvailability: DayAvailability[] = daysOfWeek.map((dayName, index) => ({
    dayOfWeek: index,
    dayName,
    slots: []
  }));
  
  // Add slots to their corresponding days
  if (Array.isArray(availabilitySlots)) {
    availabilitySlots.forEach(slot => {
      console.log(`Processing slot: dayOfWeek=${slot.dayOfWeek}, time=${slot.startTime}-${slot.endTime}, id=${slot.id}`);
      const dayIndex = slot.dayOfWeek;
      if (dayIndex >= 0 && dayIndex < 7) {
        weeklyAvailability[dayIndex].slots.push(slot);
      } else {
        console.error(`Invalid day of week in availability data: ${dayIndex}`);
      }
    });
  } else {
    console.error("availabilitySlots is not an array:", availabilitySlots);
  }
  
  // Sort slots by start time within each day
  weeklyAvailability.forEach(day => {
    day.slots.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
    console.log(`Day ${day.dayName} has ${day.slots.length} slots`);
  });
  
  return weeklyAvailability;
}
