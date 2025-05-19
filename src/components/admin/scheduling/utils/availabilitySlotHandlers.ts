
import { AvailabilitySlot } from '../week-view/weekViewUtils';

/**
 * Prepare availability slot data for click handling
 * This function stores the slot data in sessionStorage to be used by the event creation dialog
 */
export const handleAvailabilitySlotClick = (slot: AvailabilitySlot): void => {
  // Store the slot data in sessionStorage for the event creation dialog
  sessionStorage.setItem('availabilitySlot', JSON.stringify({
    dayOfWeek: slot.dayOfWeek,
    startHour: slot.startHour,
    startMinute: slot.startMinute,
    endHour: slot.endHour,
    endMinute: slot.endMinute,
    userId: slot.userId,
    userName: slot.userName || 'Unknown',
    category: slot.category
  }));
};

/**
 * Create a date object for the given day of week based on the current week
 */
export const getDateFromDayOfWeek = (dayOfWeek: number, baseDate = new Date()): Date => {
  const currentDay = baseDate.getDay();
  const daysToAdd = dayOfWeek - currentDay;
  
  const resultDate = new Date(baseDate);
  resultDate.setDate(baseDate.getDate() + daysToAdd);
  return resultDate;
};

/**
 * Format a time value for display (e.g., "9:00 AM")
 */
export const formatTime = (hour: number, minute: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
