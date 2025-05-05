
import { supabase } from "@/integrations/supabase/client";

export interface AvailabilitySlot {
  id: string;
  teacherId: string;
  teacherName?: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  courseId?: string;
  studentId?: string;
}

// Map database availability to frontend format
export const mapFromDbAvailability = (dbSlot: any): AvailabilitySlot => ({
  id: dbSlot.id,
  teacherId: dbSlot.teacher_id,
  startTime: new Date(dbSlot.start_time),
  endTime: new Date(dbSlot.end_time),
  isBooked: dbSlot.is_booked,
  courseId: dbSlot.course_id,
  studentId: dbSlot.student_id,
});

// Get available slots for a course
export const fetchAvailableSlotsForCourse = async (courseId: string): Promise<AvailabilitySlot[]> => {
  try {
    // Get slots that are not booked and associated with teachers of this course
    const { data, error } = await supabase
      .from("teacher_availability")
      .select(`
        *,
        custom_users:teacher_id (first_name, last_name)
      `)
      .eq("is_booked", false)
      .eq("course_id", courseId)
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

// Book a slot for a trial class
export const bookTrialClass = async (
  slotId: string, 
  studentId: string, 
  courseId: string
): Promise<boolean> => {
  try {
    // Update the slot to be booked
    const { error: slotError } = await supabase
      .from("teacher_availability")
      .update({
        is_booked: true,
        student_id: studentId,
      })
      .eq("id", slotId);

    if (slotError) {
      console.error("Error booking slot:", slotError);
      return false;
    }

    // Add course ID to student's trial_classes array
    const { error: userError } = await supabase
      .from("custom_users")
      .update({
        trial_classes: supabase.sql`array_append(trial_classes, ${courseId}::uuid)`,
      })
      .eq("id", studentId);

    if (userError) {
      console.error("Error updating student trial classes:", userError);
      // Attempt to revert the booking if we failed to update the user's trial_classes
      await supabase
        .from("teacher_availability")
        .update({
          is_booked: false,
          student_id: null,
        })
        .eq("id", slotId);
      return false;
    }

    // Create a calendar event for the trial class
    const { data: slot } = await supabase
      .from("teacher_availability")
      .select("*")
      .eq("id", slotId)
      .single();

    if (slot) {
      // Create calendar event for both teacher and student
      const { error: calendarError } = await supabase
        .from("calendar_events")
        .insert({
          title: `Trial Class - ${courseId}`,
          description: `Trial class for course ID: ${courseId}`,
          start_time: slot.start_time,
          end_time: slot.end_time,
          user_id: studentId, // Associate with student
          location: "Online",
          color: "#9b87f5", // Trillroute purple
        });

      if (calendarError) {
        console.error("Error creating calendar event:", calendarError);
        // The trial is still booked even if the calendar event fails
      }
    }

    return true;
  } catch (err) {
    console.error("Failed to book trial class:", err);
    return false;
  }
};

// For teachers to create availability slots
export const createAvailabilitySlot = async (
  teacherId: string,
  startTime: Date,
  endTime: Date,
  courseId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("teacher_availability")
      .insert({
        teacher_id: teacherId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_booked: false,
        course_id: courseId
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
