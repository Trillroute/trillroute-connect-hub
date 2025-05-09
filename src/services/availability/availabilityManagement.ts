
import { supabase } from "@/integrations/supabase/client";
import { fetchUserAvailabilityForDate } from "./availabilityApi";

/**
 * Copy availability slots from one day to another
 */
export const copyDayAvailability = async (
  userId: string,
  fromDay: number,
  toDay: number
): Promise<boolean> => {
  try {
    console.log(`Copying availability from day ${fromDay} to day ${toDay} for user ${userId}`);
    
    // Get all availability slots for the user's source day
    const sourceDaySlots = await fetchUserAvailabilityForDate(userId, fromDay);
    
    if (sourceDaySlots.length === 0) {
      console.log(`No slots found for day ${fromDay} to copy`);
      return false;
    }
    
    console.log(`Found ${sourceDaySlots.length} slots to copy from day ${fromDay} to day ${toDay}`);
    
    // First, delete any existing slots for the target day
    const { error: deleteError } = await supabase
      .from("user_availability")
      .delete()
      .eq("user_id", userId)
      .eq("day_of_week", toDay);
    
    if (deleteError) {
      console.error("Error deleting existing slots for target day:", deleteError);
      throw deleteError;
    }
    
    // Create new slots for the target day based on source day slots
    for (const slot of sourceDaySlots) {
      await supabase
        .from("user_availability")
        .insert({
          user_id: userId,
          day_of_week: toDay,
          start_time: slot.startTime,
          end_time: slot.endTime,
          category: slot.category
        });
    }
    
    console.log(`Successfully copied ${sourceDaySlots.length} slots from day ${fromDay} to day ${toDay}`);
    return true;
  } catch (error) {
    console.error("Error copying day availability:", error);
    throw error;
  }
};
