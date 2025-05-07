
import { supabase } from "@/integrations/supabase/client";
import { UserAvailability, mapDbAvailability } from "./types";

// Get all availability slots for a user
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    console.log(`API call: fetching availability for user ${userId}`);
    
    // Log the session for debugging
    const sessionDetails = await supabase.auth.getSession();
    console.log("Current session when fetching availability:", {
      userId: sessionDetails.data.session?.user.id,
      loggedInAs: sessionDetails.data.session?.user.email,
      role: sessionDetails.data.session?.user.user_metadata?.role,
      targetUserId: userId
    });
    
    const { data, error } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching user availability:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No availability slots found for user ${userId}`);
      return [];
    }

    const mappedData = data.map(mapDbAvailability);
    console.log(`Found ${mappedData.length} availability slots for user ${userId}`);
    
    return mappedData;
  } catch (err) {
    console.error("Failed to fetch user availability:", err);
    throw err;
  }
};

// Create a new availability slot for a user
export const createAvailabilitySlot = async (
  userId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
): Promise<UserAvailability> => {
  try {
    console.log(`Creating availability slot: user=${userId}, day=${dayOfWeek}, ${startTime}-${endTime}`);
    
    // Format startTime and endTime to ensure consistent format (HH:MM)
    const formattedStartTime = startTime.includes(':') ? startTime : `${startTime}:00`;
    const formattedEndTime = endTime.includes(':') ? endTime : `${endTime}:00`;

    const { data, error } = await supabase
      .from("user_availability")
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: formattedStartTime,
        end_time: formattedEndTime
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating availability slot:", error);
      throw error;
    }

    console.log("Availability slot created successfully:", data);
    return mapDbAvailability(data);
  } catch (err) {
    console.error("Failed to create availability slot:", err);
    throw err;
  }
};

// Update an existing availability slot
export const updateAvailabilitySlot = async (
  id: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    // Format startTime and endTime to ensure consistent format (HH:MM)
    const formattedStartTime = startTime.includes(':') ? startTime : `${startTime}:00`;
    const formattedEndTime = endTime.includes(':') ? endTime : `${endTime}:00`;

    const { error } = await supabase
      .from("user_availability")
      .update({
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating availability slot:", error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Failed to update availability slot:", err);
    throw err;
  }
};

// Delete an availability slot
export const deleteAvailabilitySlot = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting availability slot with ID: ${id}`);
    
    const { error } = await supabase
      .from("user_availability")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting availability slot:", error);
      throw error;
    }

    console.log("Availability slot deleted successfully");
    return true;
  } catch (err) {
    console.error("Failed to delete availability slot:", err);
    throw err;
  }
};
