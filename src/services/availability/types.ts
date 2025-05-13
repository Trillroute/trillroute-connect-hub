
export interface UserAvailability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  user_name?: string;
}

export interface UserAvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category?: string;
}

export interface UserAvailabilityInfo {
  slots: UserAvailabilitySlot[];
  name?: string;
  role: string;
}

export interface UserAvailabilityMap {
  [userId: string]: UserAvailabilityInfo;
}

export const AVAILABILITY_CATEGORIES = [
  'Session',
  'Break',
  'Office',
  'Meeting',
  'Class Setup',
  'QC'
];
