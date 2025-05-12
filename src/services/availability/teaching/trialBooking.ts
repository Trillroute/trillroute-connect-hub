
import { supabase } from "@/integrations/supabase/client";

// Book a trial class for a student
export const bookTrialClass = async (
  slotId: string, 
  studentId: string, 
  courseId: string, 
  courseTitle?: string
): Promise<boolean> => {
  try {
    // First, fetch the slot to get its details
    const { data: slotData, error: slotError } = await supabase
      .from("user_events")
      .select("*")
      .eq("id", slotId)
      .single();

    if (slotError || !slotData) {
      console.error("Error fetching slot for booking:", slotError);
      return false;
    }

    // Update the slot to mark it as booked
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        event_type: "trial_booking",
        metadata: {
          ...slotData.metadata,
          student_id: studentId,
          course_id: courseId,
          course_title: courseTitle || 'Trial Class'
        }
      })
      .eq("id", slotId);

    if (updateError) {
      console.error("Error booking trial class:", updateError);
      return false;
    }

    // Add this course to the user's trial_classes array
    const { error: userUpdateError } = await supabase.rpc('add_trial_class', {
      user_id: studentId,
      course_id: courseId
    });

    if (userUpdateError) {
      console.error("Error updating user trial classes:", userUpdateError);
      // We've already booked the slot, so we'll still return true
      // A separate process should handle this inconsistency
    }

    return true;
  } catch (err) {
    console.error("Failed to book trial class:", err);
    return false;
  }
};

// Cancel a booked trial class
export const cancelTrialClass = async (slotId: string): Promise<boolean> => {
  try {
    // First, get the slot to access its metadata
    const { data: slot, error: fetchError } = await supabase
      .from("user_events")
      .select("metadata")
      .eq("id", slotId)
      .single();

    if (fetchError) {
      console.error("Error fetching slot for cancellation:", fetchError);
      return false;
    }

    const studentId = slot?.metadata?.student_id;
    const courseId = slot?.metadata?.course_id;

    if (!studentId || !courseId) {
      console.error("Missing student or course ID in slot metadata");
      return false;
    }

    // Update the slot to mark it as available again
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        event_type: "availability",
        metadata: {
          ...slot.metadata,
          student_id: null
        }
      })
      .eq("id", slotId);

    if (updateError) {
      console.error("Error cancelling trial class:", updateError);
      return false;
    }

    // Remove this course from the user's trial_classes array
    const { error: userUpdateError } = await supabase.rpc('remove_trial_class', {
      user_id: studentId,
      course_id: courseId
    });

    if (userUpdateError) {
      console.error("Error updating user trial classes:", userUpdateError);
      // We've already cancelled the slot, so we'll still return true
      // A separate process should handle this inconsistency
    }

    return true;
  } catch (err) {
    console.error("Failed to cancel trial class:", err);
    return false;
  }
};
