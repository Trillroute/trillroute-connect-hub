
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, UserAvailabilityMap } from '../types';

/**
 * Map database format to frontend format
 */
export const mapDbAvailabilitySlot = (slot: any): UserAvailability => {
  return {
    id: slot.id,
    userId: slot.user_id,
    dayOfWeek: slot.day_of_week,
    startTime: slot.start_time,
    endTime: slot.end_time,
    category: slot.category || 'Session',
    createdAt: new Date(slot.created_at),
    updatedAt: new Date(slot.updated_at)
  };
};

/**
 * Helper function to build user availability map
 */
export const buildAvailabilityMap = (users: any[], availabilityData: any[]): UserAvailabilityMap => {
  // Initialize map with user info
  const availabilityMap: UserAvailabilityMap = {};
  
  users.forEach(user => {
    availabilityMap[user.id] = {
      slots: [],
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      role: user.role // Ensure role is always provided
    };
  });
  
  // Add availability slots to the map
  if (availabilityData && availabilityData.length > 0) {
    availabilityData.forEach(slot => {
      const userId = slot.user_id;
      if (availabilityMap[userId]) {
        availabilityMap[userId].slots.push(mapDbAvailabilitySlot(slot));
      }
    });
  }
  
  return availabilityMap;
};
