
import { CalendarEvent } from '../../types';

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
