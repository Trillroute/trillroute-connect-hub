
export interface UserAvailability {
  id: string;
  user_id: string;
  userId?: string; // Alias for better compatibility
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserAvailabilityMap {
  [userId: string]: {
    slots: UserAvailability[];
    name: string;
    role: string;
  };
}

export const AVAILABILITY_CATEGORIES = [
  'Session', 
  'General', 
  'Teaching', 
  'Practice', 
  'Performance', 
  'Meeting'
];
