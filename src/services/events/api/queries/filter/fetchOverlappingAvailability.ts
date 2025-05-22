import { supabase } from '@/integrations/supabase/client';
import { UserAvailability } from '@/services/availability/types';
import { mapDbAvailabilitySlot } from '@/services/availability/api/availabilityCore';

/**
 * Fetches time slots where all teachers in a course are available
 * 
 * @param courseId The course ID to check teacher availability for
 * @returns Array of overlapping availability slots
 */
export const fetchOverlappingAvailability = async (courseId: string): Promise<UserAvailability[]> => {
  try {
    console.log('Fetching overlapping availability for course:', courseId);
    
    // First, get the instructor IDs from the course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_ids')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error fetching course instructors:', courseError);
      return [];
    }
    
    const instructorIds = courseData?.instructor_ids || [];
    if (instructorIds.length === 0) {
      console.log('No instructors found for this course');
      return [];
    }
    
    console.log('Found instructors:', instructorIds);
    
    // For each instructor, fetch their availability
    const instructorAvailability: Record<string, UserAvailability[]> = {};
    
    for (const instructorId of instructorIds) {
      const { data, error } = await supabase
        .from('user_availability')
        .select('*')
        .eq('user_id', instructorId);
      
      if (error) {
        console.error('Error fetching availability for instructor', instructorId, error);
        continue;
      }
      
      instructorAvailability[instructorId] = data.map(slot => mapDbAvailabilitySlot(slot));
    }
    
    // Find overlapping time slots
    // Start with the first instructor's slots
    const firstInstructorId = instructorIds[0];
    let overlappingSlots = [...(instructorAvailability[firstInstructorId] || [])];
    
    // For each additional instructor, filter to only keep slots that overlap
    for (let i = 1; i < instructorIds.length; i++) {
      const instructorId = instructorIds[i];
      const instructorSlots = instructorAvailability[instructorId] || [];
      
      // Filter the current overlapping slots to keep only those that overlap with this instructor's slots
      overlappingSlots = overlappingSlots.filter(slot => 
        instructorSlots.some(instructorSlot => 
          // Match on day of week
          instructorSlot.dayOfWeek === slot.dayOfWeek && 
          // Check time overlap
          instructorSlot.startTime <= slot.endTime && 
          instructorSlot.endTime >= slot.startTime
        )
      );
    }
    
    console.log(`Found ${overlappingSlots.length} overlapping availability slots`);
    return overlappingSlots;
  } catch (error) {
    console.error('Exception in fetchOverlappingAvailability:', error);
    return [];
  }
};
