
import { supabase } from "@/integrations/supabase/client";

// Book a slot for a trial class
export const bookTrialClass = async (
  slotId: string, 
  studentId: string, 
  courseId: string
): Promise<boolean> => {
  try {
    // Get the event data first
    const { data: eventData, error: eventFetchError } = await supabase
      .from("user_events")
      .select("*")
      .eq("id", slotId)
      .single();
      
    if (eventFetchError || !eventData) {
      console.error("Error fetching event:", eventFetchError);
      return false;
    }

    // Create a new booking event based on the availability slot
    const { error: bookingError } = await supabase
      .from("user_events")
      .insert({
        user_id: eventData.user_id,  // Teacher ID
        title: `Trial Class - ${courseId}`,
        description: `Trial class booked by student ${studentId}`,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        event_type: "trial_booking",
        is_blocked: true,
        metadata: {
          course_id: courseId,
          student_id: studentId,
          availability_event_id: slotId
        }
      });

    if (bookingError) {
      console.error("Error creating booking event:", bookingError);
      return false;
    }

    // Update original event to mark it as blocked
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        is_blocked: true,
        metadata: {
          ...(typeof eventData.metadata === 'object' ? eventData.metadata : {}),
          booked_by: studentId,
          booked_at: new Date().toISOString()
        }
      })
      .eq("id", slotId);

    if (updateError) {
      console.error("Error updating original event:", updateError);
      return false;
    }

    // Add course ID to student's trial_classes array
    const { data: userData, error: userFetchError } = await supabase
      .from("custom_users")
      .select("trial_classes")
      .eq("id", studentId)
      .single();
      
    if (userFetchError) {
      console.error("Error fetching user trial classes:", userFetchError);
      return false;
    }
    
    // Update with the new course ID
    const updatedTrialClasses = [...(userData.trial_classes || []), courseId];
    
    const { error: userError } = await supabase
      .from("custom_users")
      .update({
        trial_classes: updatedTrialClasses
      })
      .eq("id", studentId);

    if (userError) {
      console.error("Error updating student trial classes:", userError);
      // Attempt to revert the booking
      await supabase
        .from("user_events")
        .update({
          is_blocked: false,
          metadata: {
            ...(typeof eventData.metadata === 'object' ? eventData.metadata : {}),
            booked_by: null,
            booked_at: null
          }
        })
        .eq("id", slotId);
      return false;
    }

    // Create a calendar event for the student
    const { error: studentCalendarError } = await supabase
      .from("calendar_events")
      .insert({
        title: `Trial Class - ${courseId}`,
        description: `Trial class for course ID: ${courseId}`,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        user_id: studentId,
        location: "Online",
        color: "#9b87f5", // Trillroute purple
      });

    if (studentCalendarError) {
      console.error("Error creating student calendar event:", studentCalendarError);
      // The trial is still booked even if the calendar event fails
    }

    return true;
  } catch (err) {
    console.error("Failed to book trial class:", err);
    return false;
  }
};
