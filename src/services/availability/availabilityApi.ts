
import { supabase } from "@/integrations/supabase/client";
import { UserAvailability, mapDbAvailability } from "./types";

// Get all availability slots for a user
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    console.log(`API call: fetching availability for user ${userId} from user_availability table`);
    
    const { data, error } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching user availability:", error);
      throw error;
    }

    console.log(`API result: found ${data?.length || 0} availability slots for user ${userId}`, data);
    return data ? data.map(mapDbAvailability) : [];
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
): Promise<UserAvailability | null> => {
  try {
    console.log(`Creating availability slot in user_availability table: user=${userId}, day=${dayOfWeek}, ${startTime}-${endTime}`);
    
    // Format startTime and endTime to ensure consistent format (HH:MM:SS)
    const formattedStartTime = startTime.includes(':') ? 
      (startTime.includes('.') ? startTime : startTime.includes(':00') ? startTime : `${startTime}:00`) : 
      `${startTime}:00`;
    
    const formattedEndTime = endTime.includes(':') ? 
      (endTime.includes('.') ? endTime : endTime.includes(':00') ? endTime : `${endTime}:00`) : 
      `${endTime}:00`;
    
    // First, check if this slot already exists to provide better error handling
    const { data: existingSlots, error: checkError } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .eq("day_of_week", dayOfWeek)
      .eq("start_time", formattedStartTime)
      .eq("end_time", formattedEndTime);
    
    if (checkError) {
      console.error("Error checking for existing slot:", checkError);
      throw checkError;
    }
    
    if (existingSlots && existingSlots.length > 0) {
      console.log("Slot already exists, returning existing slot");
      const error: any = new Error("This time slot already exists");
      error.code = "23505"; // Duplicate key error code
      throw error;
    }

    // Log the current session details before making the insert
    const sessionDetails = await supabase.auth.getSession();
    console.log("Current session details:", {
      userId: sessionDetails.data.session?.user.id,
      loggedInAs: sessionDetails.data.session?.user.email,
      role: sessionDetails.data.session?.user.user_metadata?.role
    });

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
    return data ? mapDbAvailability(data) : null;
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
    // Format startTime and endTime to ensure consistent format (HH:MM:SS)
    const formattedStartTime = startTime.includes(':') ? 
      (startTime.includes('.') ? startTime : startTime.includes(':00') ? startTime : `${startTime}:00`) : 
      `${startTime}:00`;
    
    const formattedEndTime = endTime.includes(':') ? 
      (endTime.includes('.') ? endTime : endTime.includes(':00') ? endTime : `${endTime}:00`) : 
      `${endTime}:00`;

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
    const { error } = await supabase
      .from("user_availability")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting availability slot:", error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Failed to delete availability slot:", err);
    throw err;
  }
};
