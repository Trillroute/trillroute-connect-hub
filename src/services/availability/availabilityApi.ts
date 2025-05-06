
import { supabase } from "@/integrations/supabase/client";
import { UserAvailability, mapDbAvailability, UserAvailabilityMap } from "./types";

// Get all availability slots for a user
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    console.log(`API call: fetching availability for user ${userId}`);
    
    const { data, error } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching user availability:", error);
      return [];
    }

    console.log(`API result: found ${data?.length || 0} availability slots for user ${userId}`, data);
    return data ? data.map(mapDbAvailability) : [];
  } catch (err) {
    console.error("Failed to fetch user availability:", err);
    return [];
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
    console.log(`Creating availability slot: user=${userId}, day=${dayOfWeek}, ${startTime}-${endTime}`);
    
    const { data, error } = await supabase
      .from("user_availability")
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating availability slot:", error);
      return null;
    }

    console.log("Availability slot created successfully:", data);
    return data ? mapDbAvailability(data) : null;
  } catch (err) {
    console.error("Failed to create availability slot:", err);
    return null;
  }
};

// Update an existing availability slot
export const updateAvailabilitySlot = async (
  id: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_availability")
      .update({
        start_time: startTime,
        end_time: endTime,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating availability slot:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to update availability slot:", err);
    return false;
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
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to delete availability slot:", err);
    return false;
  }
};
