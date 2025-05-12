
import { format } from 'date-fns';
import { DayAvailability } from '@/hooks/useUserAvailability';

// Define a common interface for both event and slot items
export interface DisplayItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isSlot: boolean;
}

// Define event-specific properties
export interface EventItem extends DisplayItem {
  isSlot: false;
  description?: string;
  location?: string;
  color?: string;
}

// Define slot-specific properties
export interface SlotItem extends DisplayItem {
  isSlot: true;
  dayName: string;
  category: string;
}

export type ListItem = EventItem | SlotItem;

// Helper to convert availability slot to a display-friendly format
export const convertSlotToDisplayItem = (slot: any, dayName: string, dayNumber: number): SlotItem => {
  // Parse the time strings into Date objects for easier comparison
  const today = new Date();
  const slotDate = new Date();
  
  // Set the date to the next occurrence of this day of week
  const currentDayNumber = today.getDay();
  let daysUntilSlot = dayNumber - currentDayNumber;
  if (daysUntilSlot <= 0) daysUntilSlot += 7; // Add a week if today or already passed
  
  slotDate.setDate(today.getDate() + daysUntilSlot);
  
  // Extract hours and minutes from the time strings
  const [startHour, startMinute] = slot.startTime.split(':').map(Number);
  const [endHour, endMinute] = slot.endTime.split(':').map(Number);
  
  // Set the hours and minutes for start and end
  const startDateTime = new Date(slotDate);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  
  const endDateTime = new Date(slotDate);
  endDateTime.setHours(endHour, endMinute, 0, 0);
  
  return {
    id: slot.id,
    title: `${slot.category} Slot`,
    start: startDateTime,
    end: endDateTime,
    dayName,
    category: slot.category,
    isSlot: true
  };
};

// Function to format time display
export const formatTimeDisplay = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Function to format date display
export const formatDateDisplay = (date: Date, dayName?: string): string => {
  const formattedDate = format(date, 'MMMM d, yyyy');
  return dayName ? `${formattedDate} (${dayName})` : formattedDate;
};

// Get color for item based on type
export const getItemColor = (item: ListItem): string => {
  if (item.isSlot) {
    const slotItem = item as SlotItem;
    switch (slotItem.category) {
      case "Session": return "#10b981"; // Green
      case "Break": return "#3b82f6"; // Blue
      case "Meeting": return "#eab308"; // Yellow
      default: return "#6b7280"; // Gray
    }
  } else {
    return (item as EventItem).color || '#4285F4'; // Default blue for events
  }
};
