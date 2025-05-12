
import { supabase } from "@/integrations/supabase/client";
import { AvailabilitySlot } from './types';
import { mapFromDbAvailability } from './mappers';

// Get available slots for a course
export const fetchAvailableSlotsForCourse = async (courseId: string): Promise<AvailabilitySlot[]> => {
  try {
    // Get slots that are 'availability' type events by teachers for this course
    const { data, error } = await supabase
      .from("user_events")
      .select(`
        *,
        custom_users!user_id(first_name, last_name)
      `)
      .eq("event_type", "availability")
      .not("is_blocked", "is", true)
      .contains("metadata", { course_id: courseId })
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching available slots:", error);
      return [];
    }

    return data ? data.map(slot => {
      const teacherData = slot.custom_users as { first_name: string; last_name: string };
      const availability = mapFromDbAvailability(slot);
      
      // Add teacher name for display purposes
      if (teacherData) {
        availability.teacherName = `${teacherData.first_name} ${teacherData.last_name}`;
      }
      
      return availability;
    }) : [];
  } catch (err) {
    console.error("Failed to fetch availability slots:", err);
    return [];
  }
};

// Check if a student has already taken a trial for a course
export const hasTrialForCourse = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("custom_users")
      .select("trial_classes")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking trial classes:", error);
      return false;
    }

    return data && data.trial_classes && data.trial_classes.includes(courseId);
  } catch (err) {
    console.error("Failed to check trial classes:", err);
    return false;
  }
};
