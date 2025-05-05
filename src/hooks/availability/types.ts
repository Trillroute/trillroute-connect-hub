
import { UserAvailability } from '@/services/availability/types';

export interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  slots: UserAvailability[];
}

export interface UseAvailabilityActions {
  addSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  updateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  deleteSlot: (id: string) => Promise<boolean>;
  copyDaySlots: (fromDay: number, toDay: number) => Promise<boolean>;
  refreshAvailability: () => Promise<void>;
}

export interface UseAvailabilityState {
  loading: boolean;
  dailyAvailability: DayAvailability[];
}

export interface UseAvailabilityResult extends UseAvailabilityActions, UseAvailabilityState {
  daysOfWeek: string[];
}

export interface DayOption {
  dayOfWeek: number;
  dayName: string;
}
