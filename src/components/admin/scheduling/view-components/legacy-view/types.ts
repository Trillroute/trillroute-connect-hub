
import { CalendarEvent } from '../../context/calendarTypes';

export interface LegacyViewProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export interface TimeSlot {
  time: string;
  items: Array<{
    userId: string;
    userName: string;
    status: 'available' | 'expired' | 'booked';
    type: string;
    color: string;
    // Optional time data for availability slots (needed for event creation)
    dayOfWeek?: number;
    startHour?: number;
    startMinute?: number;
    endHour?: number;
    endMinute?: number;
  }>;
}

export interface DayCount {
  availableCount: number;
  bookedCount: number;
  expiredCount: number;
}

export interface DayInfo {
  name: string;
  index: number;
}
