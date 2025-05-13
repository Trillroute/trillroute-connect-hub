
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
  metadata?: Record<string, any>;
  courseId?: string;
  skillId?: string;
};

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list';
