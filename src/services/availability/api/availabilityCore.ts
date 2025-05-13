
import { UserAvailability, UserAvailabilityMap } from '../types';

// Helper to map from database availability slot to UserAvailability type
export const mapDbAvailabilitySlot = (dbSlot: any): UserAvailability => {
  if (!dbSlot) {
    console.error('Attempted to map null or undefined db slot');
    throw new Error('Cannot map null or undefined slot');
  }

  // Debug log
  console.log('Mapping DB slot:', dbSlot);

  const result: UserAvailability = {
    id: dbSlot.id,
    user_id: dbSlot.user_id,
    dayOfWeek: typeof dbSlot.day_of_week === 'number' ? dbSlot.day_of_week : parseInt(dbSlot.day_of_week),
    startTime: dbSlot.start_time,
    endTime: dbSlot.end_time,
    category: dbSlot.category || 'Session'
  };

  if (dbSlot.created_at) {
    result.created_at = dbSlot.created_at;
  }

  if (dbSlot.updated_at) {
    result.updated_at = dbSlot.updated_at;
  }

  // Debug log the result
  console.log('Mapped to UserAvailability:', result);

  return result;
};

/**
 * Builds an availability map from user data and availability slots
 * 
 * @param users - Array of user objects with id, first_name, last_name, and role properties
 * @param availabilityData - Array of raw availability slot data from database
 * @returns A UserAvailabilityMap with user info and their availability slots
 */
export const buildAvailabilityMap = (users: any[], availabilityData: any[]): UserAvailabilityMap => {
  console.log(`Building availability map for ${users.length} users and ${availabilityData.length} slots`);
  
  const availabilityMap: UserAvailabilityMap = {};
  
  // Initialize map with user info
  users.forEach(user => {
    availabilityMap[user.id] = {
      name: `${user.first_name} ${user.last_name}`.trim(),
      role: user.role || 'unknown',
      slots: []
    };
  });
  
  // Add availability slots to appropriate users
  if (availabilityData.length > 0) {
    availabilityData.forEach(slot => {
      try {
        const userId = slot.user_id;
        
        if (availabilityMap[userId]) {
          const mappedSlot = mapDbAvailabilitySlot(slot);
          availabilityMap[userId].slots.push(mappedSlot);
        } else {
          console.warn(`No user found for availability slot with user_id: ${userId}`);
        }
      } catch (error) {
        console.error('Error processing availability slot:', error, slot);
      }
    });
  }
  
  // Log the result for debugging
  console.log('Availability map built:', Object.keys(availabilityMap).length, 'users');
  return availabilityMap;
};
