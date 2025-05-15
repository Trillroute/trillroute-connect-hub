
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserAvailability, UserAvailabilityMap } from '../types';

/**
 * Map a database availability slot to the application model
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
 * Build a map of user availability from raw database records
 */
export const buildAvailabilityMap = (
  availabilityData: any[],
  usersData: any[] = []
): UserAvailabilityMap => {
  const availabilityMap: UserAvailabilityMap = {};

  // Process each availability slot and add it to the map
  availabilityData.forEach(slot => {
    const userId = slot.user_id;
    
    // If this user isn't in the map yet, initialize their entry
    if (!availabilityMap[userId]) {
      // Find user data if available
      const userData = usersData.find(user => user.id === userId);
      
      availabilityMap[userId] = {
        slots: [],
        name: userData ? `${userData.first_name} ${userData.last_name}`.trim() : 'Unknown User',
        role: userData ? userData.role : 'unknown'
      };
    }
    
    // Add the mapped slot to this user's slots array
    availabilityMap[userId].slots.push(mapDbAvailabilitySlot(slot));
  });
  
  return availabilityMap;
};

/**
 * Create a database function for efficiently retrieving users with specific skills
 * This is done when the app initializes
 */
export const setupDatabaseFunctions = async (): Promise<void> => {
  try {
    // Check if the function already exists to avoid recreation
    const { data: existingFunction, error: checkError } = await supabase.rpc('get_users_with_skills', {
      skill_ids: [] as string[],
      role_filter: ''
    }).maybeSingle();
    
    if (checkError && !checkError.message.includes('does not exist')) {
      console.error('Error checking database function:', checkError);
      return;
    }
    
    if (existingFunction !== null) {
      console.log('get_users_with_skills function already exists');
      return;
    }

    // Create the database function for efficiently getting users with skills
    const { error } = await supabase.rpc('create_get_users_with_skills_function');
    
    if (error) {
      console.error('Error creating database function:', error);
    } else {
      console.log('Successfully created get_users_with_skills database function');
    }
  } catch (error) {
    console.error('Error in setupDatabaseFunctions:', error);
  }
};

// Call this function when the app initializes
setupDatabaseFunctions().catch(console.error);
