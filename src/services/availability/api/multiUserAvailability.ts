
import { supabase } from '@/integrations/supabase/client';
import { UserAvailabilityMap } from '../types';
import { buildAvailabilityMap } from './availabilityCore';

/**
 * Fetch availability for multiple users by their IDs and/or roles
 */
export const fetchUserAvailabilityForUsers = async (
  userIds: string[] = [], 
  roles: string[] = []
): Promise<UserAvailabilityMap> => {
  try {
    // If no filters, return empty map
    if (userIds.length === 0 && roles.length === 0) {
      return {};
    }

    // Prepare the user availability map
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

    // Fetch users
    const { data: users, error: userError } = await userQuery;
    if (userError) {
      console.error('Error fetching users:', userError);
      throw userError;
    }
    
    if (!users || users.length === 0) {
      console.log('No users found for availability');
      return {};
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
    
    return buildAvailabilityMap(users, availabilityData || []);
  } catch (error) {
    console.error('Failed to fetch user availability:', error);
    return {};
  }
};
