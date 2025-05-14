
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
}

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list' | 'legacy';

export interface CalendarFilterState {
  users: string[];
  courses: string[];
  skills: string[];
  startDate?: Date;
  endDate?: Date;
}
