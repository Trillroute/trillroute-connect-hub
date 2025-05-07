
import { supabase } from "@/integrations/supabase/client";

// Copy all available time slots from one day to another
export const copyDayAvailability = async (
  userId: string,
  fromDay: number,
  toDay: number
): Promise<boolean> => {
  try {
    // First, get all slots for the "from" day
    const { data: sourceSlots, error: fetchError } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .eq("day_of_week", fromDay);

    if (fetchError) {
      console.error("Error fetching source day slots:", fetchError);
      return false;
    }

    if (!sourceSlots || sourceSlots.length === 0) {
      console.log(`No slots found for day ${fromDay} to copy`);
      return false;
    }

    console.log(`Found ${sourceSlots.length} slots to copy from day ${fromDay} to day ${toDay}`);

    // Delete existing slots for the "to" day
    const { error: deleteError } = await supabase
      .from("user_availability")
      .delete()
      .eq("user_id", userId)
      .eq("day_of_week", toDay);

    if (deleteError) {
      console.error("Error deleting existing slots:", deleteError);
      return false;
    }

    // Prepare new slots for insertion
    const newSlots = sourceSlots.map(slot => ({
      user_id: userId,
      day_of_week: toDay,
      start_time: slot.start_time,
      end_time: slot.end_time
    }));

    // Insert the new slots
    const { error: insertError } = await supabase
      .from("user_availability")
      .insert(newSlots);

    if (insertError) {
      console.error("Error copying slots:", insertError);
      return false;
    }

    console.log(`Successfully copied ${newSlots.length} slots to day ${toDay}`);
    return true;
  } catch (err) {
    console.error("Failed to copy day availability:", err);
    return false;
  }
};
