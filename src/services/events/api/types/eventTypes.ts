
import { Json } from '@/integrations/supabase/types';

/**
 * Filter types supported for event filtering
 */
export type FilterType = 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;

/**
 * Props for filtering events
 */
export interface FilterEventsProps {
  filterType: FilterType;
  filterIds?: string[];
}

/**
 * Calendar event interface for typing the returned data
 */
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

/**
 * Type definition for user events from the database
 */
export interface UserEventFromDB {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  user_id: string;
  event_type: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  metadata: Json;
  // The color and location might be in metadata or not present at all
}
