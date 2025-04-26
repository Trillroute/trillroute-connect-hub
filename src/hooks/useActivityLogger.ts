
import { supabase } from '@/integrations/supabase/client';

interface ActivityLogParams {
  userId: string;
  action: string;
  component: string;
  pageUrl?: string;
  entityId?: string;
}

export function useActivityLogger() {
  const logActivity = async ({
    userId,
    action,
    component,
    pageUrl,
    entityId
  }: ActivityLogParams): Promise<void> => {
    try {
      if (!userId) return;

      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          action,
          component,
          page_url: pageUrl || window.location.pathname,
          entity_id: entityId
        });
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw, as this is a non-critical operation
    }
  };

  return { logActivity };
}
