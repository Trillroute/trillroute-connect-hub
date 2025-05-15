
import { CalendarEvent } from '../../types';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../../context/calendarTypes';

export type SetEventsFunction = (events: CalendarEvent[]) => void;
export type SetAvailabilitiesFunction = (availabilities: ContextUserAvailabilityMap) => void;

export interface ApplyFilterOptions {
  filterType: string | null;
  ids: string[];
  staffUserIds: string[];
  setEvents: SetEventsFunction;
  setAvailabilities: SetAvailabilitiesFunction;
  convertAvailabilityMap: (serviceMap: ServiceUserAvailabilityMap) => ContextUserAvailabilityMap;
}

export interface FilterResult {
  events: CalendarEvent[];
  availabilities: ContextUserAvailabilityMap;
}
