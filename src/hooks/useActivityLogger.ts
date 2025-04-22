
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to log user actions/activity in the database.
 * Usage: const logActivity = useActivityLogger();
 *        logActivity("CLICK_TAB", "Tab: teachers", window.location.pathname);
 */
const useActivityLogger = () => {
  const { user } = useAuth();

  // Log an activity entry to Supabase
  const logActivity = useCallback(
    async (action: string, component?: string, pageUrl?: string) => {
      try {
        if (!user) return;

        const entry = {
          user_id: user.id,
          action,
          component,
          page_url: pageUrl ?? window.location.pathname,
        };

        const { error } = await supabase
          .from("user_activity_logs")
          .insert(entry);

        if (error) {
          // Non-intrusive log (don't throw for UI)
          console.warn("Failed to log user activity:", error);
        }
      } catch (err) {
        console.warn("Activity logging error:", err);
      }
    },
    [user]
  );

  return logActivity;
};

export default useActivityLogger;
