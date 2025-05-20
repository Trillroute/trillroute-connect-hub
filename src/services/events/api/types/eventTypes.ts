
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType?: string;
  start: Date;
  end: Date;
  isBlocked?: boolean;
  metadata?: any;
  userId: string;
  user_id: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}
