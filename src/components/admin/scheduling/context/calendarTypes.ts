
export type CalendarViewMode = 'day' | 'week' | 'month';

// Define layer types for filtering
export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

// Define user selection type
export type SelectedUser = {
  id: string;
  name: string;
  layer: EventLayer;
};

export type CalendarContextType = {
  currentDate: Date;
  viewMode: CalendarViewMode;
  events: CalendarEvent[];
  isCreateEventOpen: boolean;
  isLoading: boolean;
  activeLayers: EventLayer[];
  selectedUsers: SelectedUser[];
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
};

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
}
