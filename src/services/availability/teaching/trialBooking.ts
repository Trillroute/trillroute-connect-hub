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

    // Filter slots and safely access metadata
    const filteredEvents = events.filter(event => {
      const metadata = event.metadata;
      if (typeof metadata === 'object' && metadata !== null) {
        // If courseId is provided, only include slots that have matching course_id or no course_id
        return courseId ? 
          ((metadata as Record<string, unknown>).course_id === courseId || !(metadata as Record<string, unknown>).course_id) : 
          true;
      }
      return true; // Include events with no metadata
    });
    
    // Map to AvailabilitySlot type with safe metadata access
    return filteredEvents.map(event => {
      const teacher = event.custom_users;
      const metadata = event.metadata;
      
      // Default values
      let isBooked = false;
      let eventCourseId: string | undefined;
      let courseTitle = 'Trial Class';
      
      // Safely access metadata if it's an object
      if (typeof metadata === 'object' && metadata !== null) {
        const typedMetadata = metadata as Record<string, unknown>;
        isBooked = typedMetadata.is_booked === true;
        eventCourseId = typedMetadata.course_id as string | undefined;
        courseTitle = (typedMetadata.course_title as string) || 'Trial Class';
      }
      
      return {
        id: event.id,
        teacherId: event.user_id,
        teacherName: teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown Teacher",
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        isBooked: isBooked,
        courseId: eventCourseId,
        courseTitle: courseTitle
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
      .filter('metadata->student_id', 'eq', userId)
      .filter('metadata->course_id', 'eq', courseId);
    
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
    
    // Ensure metadata is an object
    const currentMetadata = (typeof slot.metadata === 'object' && slot.metadata !== null) 
      ? slot.metadata as Record<string, unknown>
      : {};
    
    // Update the slot with booking information
    const updatedMetadata = {
      ...currentMetadata,
      is_booked: true,
      student_id: studentId,
      course_id: courseId,
      booking_time: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        metadata: updatedMetadata
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
    
    // Ensure metadata is an object and verify student ID
    const currentMetadata = (typeof slot.metadata === 'object' && slot.metadata !== null) 
      ? slot.metadata as Record<string, unknown>
      : {};
      
    // Verify that the student is the one who booked the slot
    if (currentMetadata.student_id !== studentId) {
      console.error("Student ID mismatch for cancellation");
      return false;
    }
    
    // Update the slot to remove booking information but keep other metadata
    const updatedMetadata = {
      ...currentMetadata,
      is_booked: false,
      student_id: null,
      booking_time: null
    };
    
    const { error: updateError } = await supabase
      .from("user_events")
      .update({
        metadata: updatedMetadata
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
