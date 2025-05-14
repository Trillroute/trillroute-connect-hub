export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
};

export type CalendarViewMode = 'day' | 'week' | 'month' | 'list' | 'legacy';
