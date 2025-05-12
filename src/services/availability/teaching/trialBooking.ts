
import { supabase } from "@/integrations/supabase/client";

// Define types for the RPC function parameters
interface TrialClassParams {
  user_id: string;
  course_id: string;
}

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

    const currentMetadata = slotData.metadata || {};
    
    // Update the slot to mark it as booked
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        event_type: "trial_booking",
        metadata: {
          ...(typeof currentMetadata === 'object' ? currentMetadata : {}),
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
    // Use explicit type casting with the defined interface
    const params: TrialClassParams = {
      user_id: studentId,
      course_id: courseId
    };
    
    // Call the RPC function with the properly typed parameters
    const { error: userUpdateError } = await supabase.rpc(
      'add_trial_class', 
      params
    );

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

    if (!slot?.metadata || typeof slot.metadata !== 'object') {
      console.error("Missing or invalid metadata in slot");
      return false;
    }

    const metadata = slot.metadata as Record<string, any>;
    const studentId = metadata.student_id;
    const courseId = metadata.course_id;

    if (!studentId || !courseId) {
      console.error("Missing student or course ID in slot metadata");
      return false;
    }

    // Update the slot to mark it as available again
    const currentMetadata = slot.metadata || {};
    
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        event_type: "availability",
        metadata: {
          ...(typeof currentMetadata === 'object' ? currentMetadata : {}),
          student_id: null
        }
      })
      .eq("id", slotId);

    if (updateError) {
      console.error("Error cancelling trial class:", updateError);
      return false;
    }

    // Remove this course from the user's trial_classes array
    // Use explicit type casting with the defined interface
    const params: TrialClassParams = {
      user_id: studentId,
      course_id: courseId
    };
    
    // Call the RPC function with the properly typed parameters
    const { error: userUpdateError } = await supabase.rpc(
      'remove_trial_class', 
      params
    );

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
