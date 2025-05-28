
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  color?: string;
  userId?: string;
  courseId?: string;
  skillId?: string;
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

export interface CalendarFilterState {
  users: string[];
  courses: string[];
  skills: string[];
  startDate?: Date;
  endDate?: Date;
}
