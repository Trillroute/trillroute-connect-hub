
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { mapToDbEvent, mapFromDbEvent } from "./mappers";
import { UserManagementUser } from "@/types/student";
import { canManageEvents } from "@/utils/permissions/modulePermissions";

export const createEvent = async (
  event: Omit<CalendarEvent, "id">, 
  userId: string, 
  user?: UserManagementUser
): Promise<CalendarEvent | null> => {
  try {
    // Check permissions if user object is provided and is an admin
    if (user && user.role === 'admin' && !canManageEvents(user, 'add')) {
      console.error("User does not have permission to create events");
      throw new Error("You don't have permission to create events");
    }
    
    const { data, error } = await supabase
      .from("calendar_events")
      .insert(mapToDbEvent(event, userId))
      .select()
      .single();
      
    if (error) {
      console.error("Error creating event:", error);
      throw error;
    }
    
    return data ? mapFromDbEvent(data) : null;
  } catch (err) {
    console.error("Failed to create event:", err);
    return null;
  }
};
