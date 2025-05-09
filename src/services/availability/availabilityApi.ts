
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, UserAvailabilityMap } from '../userAvailabilityService';
import { format, addDays, startOfWeek } from 'date-fns';

/**
 * Fetch user availability for a specific date
 */
export const fetchUserAvailabilityForDate = async (userId: string, date: Date): Promise<UserAvailability[]> => {
  try {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId)
      .eq('day_of_week', dayOfWeek);
      
    if (error) {
      console.error('Error fetching user availability:', error);
      throw error;
    }
    
    return data.map(slot => ({
      id: slot.id,
      userId: slot.user_id,
      dayOfWeek: slot.day_of_week,
      startTime: slot.start_time,
      endTime: slot.end_time,
      category: slot.category || 'Session',
      createdAt: new Date(slot.created_at),
      updatedAt: new Date(slot.updated_at)
    }));
  } catch (error) {
    console.error('Failed to fetch availability for date:', error);
    return [];
  }
};

/**
 * Fetch user availability for the entire week
 */
export const fetchUserAvailabilityForWeek = async (userId: string): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user weekly availability:', error);
      throw error;
    }
    
    return data.map(slot => ({
      id: slot.id,
      userId: slot.user_id,
      dayOfWeek: slot.day_of_week,
      startTime: slot.start_time,
      endTime: slot.end_time,
      category: slot.category || 'Session',
      createdAt: new Date(slot.created_at),
      updatedAt: new Date(slot.updated_at)
    }));
  } catch (error) {
    console.error('Failed to fetch weekly availability:', error);
    return [];
  }
};

/**
 * Fetch all availability slots for a user
 */
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user availability:', error);
      throw error;
    }
    
    return data.map(slot => ({
      id: slot.id,
      userId: slot.user_id,
      dayOfWeek: slot.day_of_week,
      startTime: slot.start_time,
      endTime: slot.end_time,
      category: slot.category || 'Session',
      createdAt: new Date(slot.created_at),
      updatedAt: new Date(slot.updated_at)
    }));
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return [];
  }
};

/**
 * Create a new availability slot for a user
 */
export const createAvailabilitySlot = async (
  userId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  category: string = 'Session'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        category: category
      });
      
    if (error) {
      console.error('Error creating availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create availability slot:', error);
    return false;
  }
};

/**
 * Update an existing availability slot
 */
export const updateAvailabilitySlot = async (
  id: string,
  startTime: string,
  endTime: string,
  category: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .update({
        start_time: startTime,
        end_time: endTime,
        category: category
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update availability slot:', error);
    return false;
  }
};

/**
 * Delete an availability slot
 */
export const deleteAvailabilitySlot = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_availability')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting availability slot:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete availability slot:', error);
    return false;
  }
};

/**
 * Fetch availability for multiple users by their IDs and/or roles
 */
export const fetchUserAvailabilityForUsers = async (
  userIds: string[] = [], 
  roles: string[] = []
): Promise<UserAvailabilityMap> => {
  try {
    // Prepare the user availability map
    const availabilityMap: UserAvailabilityMap = {};
    let userQuery = supabase.from('custom_users').select('id, first_name, last_name, role');

    // Add user filters
    if (userIds.length > 0) {
      userQuery = userQuery.in('id', userIds);
    }
    
    // Add role filters
    if (roles.length > 0) {
      if (userIds.length > 0) {
        userQuery = userQuery.or(`role.in.(${roles.join(',')})`);
      } else {
        userQuery = userQuery.in('role', roles);
      }
    }
    
    // If no filters, return empty map
    if (userIds.length === 0 && roles.length === 0) {
      return availabilityMap;
    }

    // Fetch users
    const { data: users, error: userError } = await userQuery;
    if (userError) {
      console.error('Error fetching users:', userError);
      throw userError;
    }
    
    if (!users || users.length === 0) {
      console.log('No users found for availability');
      return availabilityMap;
    }
    
    // Create a list of user IDs to fetch availability for
    const userIdList = users.map(user => user.id);
    
    // Fetch availability for all users
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('user_availability')
      .select('*')
      .in('user_id', userIdList);
      
    if (availabilityError) {
      console.error('Error fetching user availability:', availabilityError);
      throw availabilityError;
    }
    
    // Initialize map with user info
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
          availabilityMap[userId].slots.push({
            id: slot.id,
            userId: slot.user_id,
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            category: slot.category || 'Session',
            createdAt: new Date(slot.created_at),
            updatedAt: new Date(slot.updated_at)
          });
        }
      });
    }
    
    return availabilityMap;
  } catch (error) {
    console.error('Failed to fetch user availability:', error);
    return {};
  }
};
