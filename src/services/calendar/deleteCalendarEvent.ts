
import { supabase } from "@/integrations/supabase/client";
import { canManageEvents } from "@/utils/permissions/modulePermissions";
import { UserManagementUser } from "@/types/student";

export const deleteEvent = async (id: string, userId: string, user?: UserManagementUser): Promise<boolean> => {
  try {
    // For admins, check if they have delete permission
    if (user && user.role === 'admin') {
      const hasDeletePermission = canManageEvents(user, 'delete');
      
      if (hasDeletePermission) {
        // Admin with delete permission can delete any event
        const { error } = await supabase
          .from("calendar_events")
          .delete()
          .eq("id", id);
          
        if (error) {
          console.error("Error deleting event:", error);
          throw error;
        }
        
        return true;
      } else {
        // Admin without delete permission can only delete their own events
        const { error } = await supabase
          .from("calendar_events")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);
          
        if (error) {
          console.error("Error deleting event:", error);
          throw error;
        }
        
        return true;
      }
    } else {
      // Non-admin users can only delete their own events
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
        
      if (error) {
        console.error("Error deleting event:", error);
        throw error;
      }
      
      return true;
    }
  } catch (err) {
    console.error("Failed to delete event:", err);
    return false;
  }
};
