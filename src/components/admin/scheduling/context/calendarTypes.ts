
export type CalendarViewMode = 'day' | 'week' | 'month' | 'list';

// Define layer types for filtering
export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

// Define user selection type
export type SelectedUser = {
  id: string;
  name: string;
  layer: EventLayer;
};

// UserAvailability interface - updated to match service's interface
export interface UserAvailability {
  id: string;
  userId?: string;  // Make userId optional to match the service interface
  user_id?: string; // Keep user_id optional as well
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// UserAvailabilityMap interface - updated to match service's interface
export interface UserAvailabilityMap {
  [userId: string]: {
    slots: UserAvailability[];
    name: string;
    role: string;
  };
}

// Update the CalendarContextType to include availability data
export interface CalendarContextType {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
  availabilities: UserAvailabilityMap;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (open: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  toggleLayer: (layer: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  handleUpdateEvent: (id: string, eventData: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  handleDeleteEvent: (id: string) => Promise<boolean>;
  handleDateSelect: (date: Date | undefined) => void;
  refreshEvents: () => Promise<void>;
  filterEventsByRole: (roles: string[]) => Promise<void>;
  filterEventsByUser: (userId: string) => Promise<void>;
  setAvailabilities: (availabilities: UserAvailabilityMap) => void;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
}
