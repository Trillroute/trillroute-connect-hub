import { ReactNode } from "react";

export type EventLayer = string;

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  color?: string;
  userId?: string;
  eventType?: string;
  isBlocked?: boolean;
  metadata?: any;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
}

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list' | 'legacy';

export interface SelectedUser {
  id: string;
  name: string;
  role?: string;
  email?: string;
  layer?: EventLayer;
}

export interface UserAvailabilityMap {
  [userId: string]: {
    name: string;
    role: string;
    slots: Array<{
      id: string;
      user_id: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      category?: string;
    }>;
  };
}

export interface CalendarContextType {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
  availabilities: UserAvailabilityMap;
  showAvailability: boolean;
  setCurrentDate: (date: Date) => void;
  setViewMode: (viewMode: string) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (isOpen: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  setAvailabilities: (availabilities: UserAvailabilityMap) => void;
  toggleLayer: (layerId: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  handleUpdateEvent: (id: string, event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
  handleDateSelect: (date: Date) => void;
  refreshEvents: () => Promise<void>;
  filterEventsByRole: (role: string) => void;
  filterEventsByUser: (userId: string) => void;
}

export interface CalendarProviderProps {
  children: ReactNode;
  showAvailability?: boolean;
}
