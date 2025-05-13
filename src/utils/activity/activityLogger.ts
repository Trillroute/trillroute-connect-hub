
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs user activity to the database
 */
export const logUserActivity = async (
  userId: string,
  action: string,
  component: string,
  entityId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        component,
        page_url: window.location.pathname,
        entity_id: entityId
      });

    if (error) {
      console.error('Error logging user activity:', error);
    }
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
};
