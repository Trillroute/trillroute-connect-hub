
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability, UserAvailabilityMap } from '../types';
import { buildAvailabilityMap } from './availabilityCore';

/**
 * Fetch availability for all staff members (teachers, admins, etc)
 */
export const fetchAllStaffAvailability = async (): Promise<UserAvailabilityMap> => {
  try {
    console.log('Fetching all staff availability');
    
    // First get all staff users
    const { data: staffUsers, error: userError } = await supabase
      .from('custom_users')
      .select('id, first_name, last_name, role')
      .in('role', ['teacher', 'admin', 'superadmin']);
      
    if (userError) {
      console.error('Error fetching staff users:', userError);
      throw userError;
    }
    
    if (!staffUsers || staffUsers.length === 0) {
      console.log('No staff users found');
      return {};
    }
    
    // Get all user IDs
    const userIds = staffUsers.map(user => user.id);
    
    // Fetch availability for these users
    const { data: availability, error: availabilityError } = await supabase
      .from('user_availability')
      .select('*')
      .in('user_id', userIds);
      
    if (availabilityError) {
      console.error('Error fetching availability:', availabilityError);
      throw availabilityError;
    }
    
    console.log(`Fetched ${availability?.length || 0} availability slots for ${staffUsers.length} staff users`);
    
    // Build and return availability map
    return buildAvailabilityMap(staffUsers, availability || []);
  } catch (error) {
    console.error('Failed to fetch staff availability:', error);
    return {};
  }
};

/**
 * Fetch availability for specific users or by roles
 * 
 * @param userIds - Array of user IDs to fetch availability for
 * @param roles - Array of roles to fetch availability for (e.g., ['teacher', 'admin'])
 */
export const fetchUserAvailabilityForUsers = async (
  userIds: string[] = [], 
  roles: string[] = []
): Promise<UserAvailabilityMap> => {
  try {
    console.log(`Fetching availability for ${userIds.length} specific users and/or roles: ${roles.join(', ')}`);
    
    let query = supabase
      .from('custom_users')
      .select('id, first_name, last_name, role');
    
    // if neither userIds nor roles are provided, return empty result
    if (userIds.length === 0 && roles.length === 0) {
      console.log('No user IDs or roles provided for availability lookup');
      return {};
    }
    
    // Add filters based on provided parameters
    if (userIds.length > 0 && roles.length > 0) {
      // If we have both user IDs and roles, use OR to combine them
      query = query.or(`id.in.(${userIds.join(',')}),role.in.(${roles.join(',')})`);
    } else if (userIds.length > 0) {
      // Just filter by user IDs
      query = query.in('id', userIds);
    } else if (roles.length > 0) {
      // Just filter by roles
      query = query.in('role', roles);
    }
    
    const { data: users, error: userError } = await query;
      
    if (userError) {
      console.error('Error fetching users for availability:', userError);
      throw userError;
    }
    
    if (!users || users.length === 0) {
      console.log('No matching users found for availability query');
      return {};
    }
    
    // Get all matching user IDs
    const matchingUserIds = users.map(user => user.id);
    
    // Fetch availability for these users
    const { data: availability, error: availabilityError } = await supabase
      .from('user_availability')
      .select('*')
      .in('user_id', matchingUserIds);
      
    if (availabilityError) {
      console.error('Error fetching specific users availability:', availabilityError);
      throw availabilityError;
    }
    
    console.log(`Fetched ${availability?.length || 0} availability slots for ${users.length} filtered users`);
    
    // Build and return availability map
    return buildAvailabilityMap(users, availability || []);
  } catch (error) {
    console.error('Failed to fetch filtered availability:', error);
    return {};
  }
};
