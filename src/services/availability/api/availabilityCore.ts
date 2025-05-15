
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Create a database function for efficiently retrieving users with specific skills
 * This is done when the app initializes
 */
export const setupDatabaseFunctions = async (): Promise<void> => {
  try {
    // Check if the function already exists to avoid recreation
    const { data: existingFunction } = await supabase.rpc('get_users_with_skills', {
      skill_ids: [],
      role_filter: ''
    }).catch(() => ({ data: null }));
    
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
