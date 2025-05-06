
import { UserAvailability } from '@/services/availability/types';

export interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  slots: UserAvailability[];
}

export interface UseAvailabilityResult {
  loading: boolean;
  dailyAvailability: DayAvailability[];
  refreshAvailability: () => Promise<void>;
  addSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  updateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  deleteSlot: (id: string) => Promise<boolean>;
  copyDaySlots: (fromDay: number, toDay: number) => Promise<boolean>;
  daysOfWeek: string[];
}

export interface UseAvailabilityActions {
  refreshAvailability: () => Promise<void>;
  addSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  updateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  deleteSlot: (id: string) => Promise<boolean>;
  copyDaySlots: (fromDay: number, toDay: number) => Promise<boolean>;
}
