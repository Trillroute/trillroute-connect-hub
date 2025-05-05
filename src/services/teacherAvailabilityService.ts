
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
export const mapFromDbAvailability = (dbEvent: any): AvailabilitySlot => ({
  id: dbEvent.id,
  teacherId: dbEvent.user_id,
  startTime: new Date(dbEvent.start_time),
  endTime: new Date(dbEvent.end_time),
  isBooked: dbEvent.event_type === 'trial_booking',
  courseId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.course_id : undefined,
  studentId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.student_id : undefined,
});

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

// Create blocked hours for a user
export const createBlockedHours = async (
  userId: string,
  dayOfWeek: number,
  startTime: string, // format: "HH:MM"
  endTime: string, // format: "HH:MM"
  isRecurring: boolean = true,
  reason?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("blocked_hours")
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_recurring: isRecurring,
        reason
      });

    if (error) {
      console.error("Error creating blocked hours:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to create blocked hours:", err);
    return false;
  }
};

// Get blocked hours for a user
export const getBlockedHours = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("blocked_hours")
      .select("*")
      .eq("user_id", userId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching blocked hours:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch blocked hours:", err);
    return [];
  }
};
