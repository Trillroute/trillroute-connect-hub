
import { supabase } from "@/integrations/supabase/client";
import { UserManagementUser } from "@/types/student";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

export const deleteEvent = async (
  id: string,
  userId: string,
  user?: UserManagementUser
): Promise<boolean> => {
  try {
    // Check permissions if user object is provided and is an admin
    if (user && user.role === 'admin' && !canManageEvents(user, 'delete')) {
      console.error("User does not have permission to delete events");
      throw new Error("You don't have permission to delete events");
    }
    
    const { error } = await supabase
      .from("user_events")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Failed to delete event:", err);
    return false;
  }
};
