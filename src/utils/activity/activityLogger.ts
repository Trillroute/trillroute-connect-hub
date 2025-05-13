import { supabase } from '@/integrations/supabase/client';

// Keep track of recent logs to prevent duplicates within a short time period
const recentLogs: Map<string, number> = new Map();
const LOG_DEBOUNCE_TIME = 2000; // 2 seconds

/**
 * Logs user activity to the database with debouncing to prevent excessive writes
 */
export const logUserActivity = async (
  userId: string,
  action: string,
  component: string,
  entityId?: string
): Promise<void> => {
  try {
    // Create a log key to identify similar actions
    const logKey = `${userId}:${action}:${component}:${entityId || ''}`;
    const now = Date.now();
    
    // Check if we've logged this recently
    const lastLogTime = recentLogs.get(logKey);
    if (lastLogTime && now - lastLogTime < LOG_DEBOUNCE_TIME) {
      // Skip logging if the same action was logged recently
      return;
    }
    
    // Update the recent logs map
    recentLogs.set(logKey, now);
    
    // Clean up old entries from the map
    if (recentLogs.size > 100) {
      const keysToDelete = [];
      for (const [key, timestamp] of recentLogs.entries()) {
        if (now - timestamp > LOG_DEBOUNCE_TIME * 2) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => recentLogs.delete(key));
    }
    
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
