
import { supabase } from "@/integrations/supabase/client";
import { AvailabilitySlot } from "./types";

/**
 * Create an availability slot for a teacher
 * 
 * @param teacherId The ID of the teacher
 * @param startTime The start time of the availability slot
 * @param endTime The end time of the availability slot
 * @param courseId Optional course ID to link the slot to
 * @returns True if the slot was created successfully, false otherwise
 */
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

/**
 * Fetch available slots for a specific course
 * 
 * @param courseId The ID of the course
 * @returns An array of available slots
 */
export const fetchAvailableSlotsForCourse = async (courseId: string): Promise<AvailabilitySlot[]> => {
  try {
    // Query user_events table for availability slots
    const { data: events, error } = await supabase
      .from("user_events")
      .select(`
        id,
        user_id,
        start_time,
        end_time,
        title,
        metadata,
        custom_users:user_id (first_name, last_name)
      `)
      .eq("event_type", "availability")
      .eq("is_blocked", false)
      .gte("start_time", new Date().toISOString());
    
    if (error) {
      console.error("Error fetching available slots:", error);
      return [];
    }

    // Filter slots based on course ID if provided, or get general slots
    const filteredEvents = courseId 
      ? events.filter(event => event.metadata?.course_id === courseId || !event.metadata?.course_id)
      : events;
    
    // Map to AvailabilitySlot type
    return filteredEvents.map(event => {
      const teacher = event.custom_users;
      return {
        id: event.id,
        teacherId: event.user_id,
        teacherName: teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown Teacher",
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        isBooked: !!event.metadata?.is_booked,
        courseId: event.metadata?.course_id,
        courseTitle: event.metadata?.course_title || 'Trial Class'
      };
    });
  } catch (err) {
    console.error("Failed to fetch available slots:", err);
    return [];
  }
};

/**
 * Check if a user has a trial booking for a specific course
 * 
 * @param userId The ID of the user
 * @param courseId The ID of the course
 * @returns True if the user has a trial booking for the course, false otherwise
 */
export const hasTrialForCourse = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    // Query user_events table for trial bookings
    const { data, error } = await supabase
      .from("user_events")
      .select("*")
      .eq("event_type", "trial_booking")
      .eq("metadata->student_id", userId)
      .eq("metadata->course_id", courseId);
    
    if (error) {
      console.error("Error checking trial booking:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error("Failed to check trial booking:", err);
    return false;
  }
};

/**
 * Book a trial class
 * 
 * @param slotId The ID of the availability slot
 * @param studentId The ID of the student
 * @param courseId The ID of the course
 * @returns True if the trial was booked successfully, false otherwise
 */
export const bookTrialClass = async (
  slotId: string,
  studentId: string,
  courseId: string
): Promise<boolean> => {
  try {
    // Get the slot details first
    const { data: slot, error: slotError } = await supabase
      .from("user_events")
      .select("*")
      .eq("id", slotId)
      .single();
    
    if (slotError || !slot) {
      console.error("Error fetching slot for booking:", slotError);
      return false;
    }
    
    // Update the slot with booking information
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        metadata: {
          ...slot.metadata,
          is_booked: true,
          student_id: studentId,
          course_id: courseId,
          booking_time: new Date().toISOString()
        }
      })
      .eq("id", slotId);
    
    if (updateError) {
      console.error("Error updating slot with booking:", updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Failed to book trial class:", err);
    return false;
  }
};

/**
 * Cancel a trial class booking
 * 
 * @param slotId The ID of the availability slot
 * @param studentId The ID of the student
 * @returns True if the trial was cancelled successfully, false otherwise
 */
export const cancelTrialClass = async (
  slotId: string,
  studentId: string
): Promise<boolean> => {
  try {
    // Get the slot details first
    const { data: slot, error: slotError } = await supabase
      .from("user_events")
      .select("*")
      .eq("id", slotId)
      .single();
    
    if (slotError || !slot) {
      console.error("Error fetching slot for cancellation:", slotError);
      return false;
    }
    
    // Verify that the student is the one who booked the slot
    if (slot.metadata?.student_id !== studentId) {
      console.error("Student ID mismatch for cancellation");
      return false;
    }
    
    // Update the slot to remove booking information
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        metadata: {
          ...slot.metadata,
          is_booked: false,
          student_id: null,
          booking_time: null
        }
      })
      .eq("id", slotId);
    
    if (updateError) {
      console.error("Error updating slot for cancellation:", updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Failed to cancel trial class:", err);
    return false;
  }
};
