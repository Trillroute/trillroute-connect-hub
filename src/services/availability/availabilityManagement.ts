
import { supabase } from "@/integrations/supabase/client";

// Copy availability from one day to another
export const copyDayAvailability = async (
  userId: string,
  fromDay: number,
  toDay: number
): Promise<boolean> => {
  try {
    // First, get all slots for the source day
    const { data: sourceSlots, error: sourceError } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .eq("day_of_week", fromDay);

    if (sourceError) {
      console.error("Error fetching source day slots:", sourceError);
      return false;
    }

    if (!sourceSlots || sourceSlots.length === 0) {
      console.warn("No slots found for the source day");
      return false;
    }

    // Delete existing slots for the target day
    const { error: deleteError } = await supabase
      .from("user_availability")
      .delete()
      .eq("user_id", userId)
      .eq("day_of_week", toDay);

    if (deleteError) {
      console.error("Error deleting existing slots for target day:", deleteError);
      return false;
    }

    // Create new slots for the target day based on source day
    const newSlots = sourceSlots.map(slot => ({
      user_id: userId,
      day_of_week: toDay,
      start_time: slot.start_time,
      end_time: slot.end_time
    }));

    const { error: insertError } = await supabase
      .from("user_availability")
      .insert(newSlots);

    if (insertError) {
      console.error("Error copying slots to target day:", insertError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to copy day availability:", err);
    return false;
  }
};
