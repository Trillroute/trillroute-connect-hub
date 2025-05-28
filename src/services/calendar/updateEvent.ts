
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { mapToDbEvent, mapFromDbEvent } from "./mappers";
import { UserManagementUser } from "@/types/student";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

export const updateEvent = async (
  id: string,
  event: Omit<CalendarEvent, "id">,
  userId: string,
  user?: UserManagementUser
): Promise<CalendarEvent | null> => {
  try {
    // Check permissions if user object is provided and is an admin
    if (user && user.role === 'admin' && !canManageEvents(user, 'edit')) {
      console.error("User does not have permission to update events");
      throw new Error("You don't have permission to update events");
    }
    
    const eventData = mapToDbEvent(event, userId);
    
    const { data, error } = await supabase
      .from("user_events")
      .update(eventData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating event:", error);
      throw error;
    }
    
    return data ? mapFromDbEvent(data) : null;
  } catch (err) {
    console.error("Failed to update event:", err);
    return null;
  }
};
