export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  location?: string;
  color?: string;
  userId?: string;
  courseId?: string;
  skillId?: string;
}

export type EventLayer = 'teachers' | 'students' | 'admins' | 'superadmins';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list';

export interface SelectedUser {
  id: string;
  name: string;
  layer: EventLayer;
}

export interface UserAvailability {
  id: string;
  user_id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
}

export interface UserAvailabilityInfo {
  name: string;
  role?: string;
  slots: UserAvailability[];
}

export interface UserAvailabilityMap {
  [userId: string]: UserAvailabilityInfo;
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
  showAvailability?: boolean;
  
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setIsCreateEventOpen: (isOpen: boolean) => void;
  setActiveLayers: (layers: EventLayer[]) => void;
  setSelectedUsers: (users: SelectedUser[]) => void;
  setAvailabilities: (availabilities: UserAvailabilityMap) => void;
  
  toggleLayer: (layer: EventLayer) => void;
  toggleUser: (user: SelectedUser) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  handleCreateEvent: (event: any) => Promise<void>;
  handleUpdateEvent: (id: string, event: any) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
  handleDateSelect: (date: Date) => void;
  refreshEvents: () => Promise<void>;
  filterEventsByRole: (roles: string[]) => void;
  filterEventsByUser: (user: SelectedUser) => void;
}
