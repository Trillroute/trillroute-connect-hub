
import { UserAvailability } from '@/services/availability/types';

export interface FilterState {
  users: string[];
  startDate?: Date;
  endDate?: Date;
  courses: string[];
  skills: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  userId?: string;
  courseId?: string;
  skillId?: string;
  color?: string;
}

export interface CalendarUserAvailability {
  id: string;
  userId: string;
  userName?: string;
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  category?: string;
}

export interface UseFilteredEventsProps {
  events?: CalendarEvent[];
  filters?: FilterState;
  availabilities?: UserAvailabilityMap | null;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export interface UserAvailabilityMap {
  [userId: string]: {
    name?: string;
    role?: string;
    slots: UserAvailability[];
  };
}
