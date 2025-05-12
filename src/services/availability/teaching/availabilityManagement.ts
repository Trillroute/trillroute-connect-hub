
import { supabase } from "@/integrations/supabase/client";

// For teachers to create availability slots
export const createAvailabilitySlot = async (
  teacherId: string,
  startTime: Date,
  endTime: Date,
  courseId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_events")
      .insert({
        user_id: teacherId,
        title: courseId ? "Course-specific Availability" : "General Availability",
        description: "Teacher availability for trial classes",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        event_type: "availability",
        is_blocked: false,
        metadata: courseId ? { course_id: courseId } : {}
      });

    if (error) {
      console.error("Error creating availability slot:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to create availability slot:", err);
    return false;
  }
};

