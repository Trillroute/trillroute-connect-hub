
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, UserAvailabilityMap } from '../types';

/**
 * Maps a database availability slot to our internal format
 */
export const mapDbAvailabilitySlot = (dbSlot: any): UserAvailability => {
  return {
    id: dbSlot.id,
    user_id: dbSlot.user_id,
    dayOfWeek: dbSlot.day_of_week,
    startTime: dbSlot.start_time,
    endTime: dbSlot.end_time,
    category: dbSlot.category || 'Default'
  };
};

/**
 * Build availability map from users and slots
 */
export const buildAvailabilityMap = (
  users: any[],
  availabilitySlots: any[]
): UserAvailabilityMap => {
  const result: UserAvailabilityMap = {};
  
  // Initialize entries for each user
  users.forEach(user => {
    result[user.id] = {
      slots: [],
      name: `${user.first_name} ${user.last_name}`.trim(),
      role: user.role || 'unknown'
    };
  });
  
  // Add slots to the respective users
  availabilitySlots.forEach(slot => {
    const userId = slot.user_id;
    if (result[userId]) {
      result[userId].slots.push(mapDbAvailabilitySlot(slot));
    }
  });
  
  return result;
};
