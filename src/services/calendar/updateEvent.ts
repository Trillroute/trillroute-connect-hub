
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
    // For admins, check if they have edit permission
    if (user && user.role === 'admin') {
      const hasEditPermission = canManageEvents(user, 'edit');
      
      if (hasEditPermission) {
        // Admin with edit permission can edit any event
        const { data, error } = await supabase
          .from("calendar_events")
          .update(mapToDbEvent(event, userId))
          .eq("id", id)
          .select()
          .single();
          
        if (error) {
          console.error("Error updating event:", error);
          throw error;
        }
        
        return data ? mapFromDbEvent(data) : null;
      } else {
        // Admin without edit permission can only edit their own events
        const { data, error } = await supabase
          .from("calendar_events")
          .update(mapToDbEvent(event, userId))
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();
          
        if (error) {
          console.error("Error updating event:", error);
          throw error;
        }
        
        return data ? mapFromDbEvent(data) : null;
      }
    } else {
      // Non-admin users can only edit their own events
      const { data, error } = await supabase
        .from("calendar_events")
        .update(mapToDbEvent(event, userId))
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating event:", error);
        throw error;
      }
      
      return data ? mapFromDbEvent(data) : null;
    }
  } catch (err) {
    console.error("Failed to update event:", err);
    return null;
  }
};
