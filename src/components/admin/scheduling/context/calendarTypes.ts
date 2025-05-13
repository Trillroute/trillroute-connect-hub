import { ReactNode } from 'react';
import { CalendarEvent as BaseCalendarEvent } from '../types';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list' | 'legacy';

export interface CalendarEvent extends BaseCalendarEvent {
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional fields for flexibility
}

export interface UserAvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
  [key: string]: any;
}

export interface UserAvailabilityData {
  slots: UserAvailabilitySlot[];
  name?: string;
  role?: string;
}

export interface UserAvailabilityMap {
  [userId: string]: UserAvailabilityData;
}

// Add EventLayer and SelectedUser types
export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

export interface SelectedUser {
  id: string;
  name: string;
  layer: EventLayer;
}

export interface CalendarContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  currentDate: Date;
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;
  setCurrentDate: (date: Date) => void;
  navigateToToday: () => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  refreshEvents: () => Promise<void>;
  handleCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => Promise<string | null>;
  handleUpdateEvent: (id: string, eventData: Partial<Omit<CalendarEvent, 'id'>>) => Promise<boolean>;
  handleDeleteEvent: (id: string) => Promise<boolean>;
  availabilities: UserAvailabilityMap;
  setAvailabilities: (availabilities: UserAvailabilityMap) => void;
  setEvents: (events: CalendarEvent[]) => void;
  // Add missing properties for sidebar and filters
  handleDateSelect: (date: Date | undefined) => void;
  setIsCreateEventOpen: (isOpen: boolean) => void;
  isCreateEventOpen: boolean;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  // Add properties for layers and filters
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  toggleLayer: (layer: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  filterEventsByRole: (roles: string[]) => Promise<void>;
  filterEventsByUser: (userId: string) => Promise<void>;
}

export interface CalendarProviderProps {
  children: ReactNode;
  initialDate?: Date;
  initialViewMode?: CalendarViewMode;
}
