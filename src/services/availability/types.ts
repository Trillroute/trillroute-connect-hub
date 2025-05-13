
// Define the availability slot types

export interface UserAvailability {
  id: string;
  user_id: string;
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
    role?: string;
  };
}

// Categories for availability slots
export const AVAILABILITY_CATEGORIES = [
  'Session',
  'Break',
  'Office',
  'Meeting',
  'Class Setup',
  'QC'
];

// Status types for availability slots
export type AvailabilityStatus = 'available' | 'booked' | 'blocked';
