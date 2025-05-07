
// Define core types for the availability service

export interface UserAvailability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  createdAt: Date;
  updatedAt: Date;
}

// Convert database format to frontend format
export const mapDbAvailability = (dbItem: any): UserAvailability => ({
  id: dbItem.id,
  userId: dbItem.user_id,
  dayOfWeek: dbItem.day_of_week,
  startTime: dbItem.start_time,
  endTime: dbItem.end_time,
  createdAt: new Date(dbItem.created_at),
  updatedAt: new Date(dbItem.updated_at)
});

// User information along with their availability slots
export interface UserAvailabilityInfo {
  slots: UserAvailability[];
  name: string;
  role?: string;
}

// Group of availability slots by user ID
export interface UserAvailabilityMap {
  [userId: string]: UserAvailabilityInfo;
}
