
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

// Convert database format to frontend format with detailed logging
export const mapDbAvailability = (dbItem: any): UserAvailability => {
  if (!dbItem) {
    console.error("Attempted to map undefined/null DB item to availability object");
    throw new Error("Invalid availability data");
  }
  
  if (!dbItem.id || !dbItem.user_id || typeof dbItem.day_of_week !== 'number') {
    console.error("Invalid DB item structure:", dbItem);
    throw new Error("DB item missing required fields");
  }
  
  const mappedItem = {
    id: dbItem.id,
    userId: dbItem.user_id,
    dayOfWeek: dbItem.day_of_week,
    startTime: dbItem.start_time,
    endTime: dbItem.end_time,
    createdAt: new Date(dbItem.created_at),
    updatedAt: new Date(dbItem.updated_at)
  };
  
  console.log("Mapped DB item to availability object:", { 
    original: dbItem,
    mapped: mappedItem
  });
  
  return mappedItem;
};

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
