
import { supabase } from '@/integrations/supabase/client';
import { AvailabilitySlot } from './types';
import { toast } from '@/components/ui/use-toast';

/**
 * Interface for trial class parameters
 */
interface TrialClassParams {
  slotId: string;
  userId: string;
  courseId: string;
}

/**
 * Book a trial class in an available slot
 * 
 * @param slotId - ID of the availability slot to book
 * @param userId - User ID booking the slot
 * @param courseId - Course ID for the trial
 * @returns True if booking was successful, false otherwise
 */
export const bookTrialClass = async (
  slotId: string,
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    console.log(`Booking trial class: slotId=${slotId}, userId=${userId}, courseId=${courseId}`);
    
    // First check if the user already has a trial for this course
    const hasTrialAlready = await hasTrialForCourse(userId, courseId);
    
    if (hasTrialAlready) {
      console.warn('User already has a trial for this course');
      toast({
        title: 'Already booked',
        description: 'You have already booked a trial class for this course',
        variant: 'destructive',
      });
      return false;
    }
    
    // Check if slot is still available
    const isAvailable = await checkSlotAvailability(slotId);
    
    if (!isAvailable) {
      console.warn('Slot is no longer available');
      toast({
        title: 'Slot unavailable',
        description: 'This slot is no longer available',
        variant: 'destructive',
      });
      return false;
    }
    
    // Book the slot
    const params = {
      slot_id: slotId,
      user_id: userId,
      course_id: courseId
    };
    
    // Call the book_trial_class RPC function
    const { error } = await supabase
      .rpc('book_trial_class', params);
    
    if (error) {
      console.error('Error booking trial class:', error);
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Trial class booked successfully');
    return true;
  } catch (error) {
    console.error('Error in bookTrialClass:', error);
    return false;
  }
};

/**
 * Cancel a trial class booking
 * 
 * @param slotId - ID of the booked slot to cancel
 * @param userId - User ID who booked the slot
 * @returns True if cancellation was successful, false otherwise
 */
export const cancelTrialClass = async (
  slotId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Cancelling trial class: slotId=${slotId}, userId=${userId}`);
    
    const params = {
      slot_id: slotId,
      user_id: userId
    };
    
    // Call the cancel_trial_class RPC function
    const { error } = await supabase
      .rpc('cancel_trial_class', params);
    
    if (error) {
      console.error('Error cancelling trial class:', error);
      toast({
        title: 'Cancellation failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Trial class cancelled successfully');
    return true;
  } catch (error) {
    console.error('Error in cancelTrialClass:', error);
    return false;
  }
};

/**
 * Check if a slot is still available for booking
 * 
 * @param slotId The ID of the availability slot to check
 * @returns True if the slot is available, false otherwise
 */
export const checkSlotAvailability = async (slotId: string): Promise<boolean> => {
  try {
    // Use appropriate table name for trial slots
    const { data, error } = await supabase
      .from('teacher_trial_slots')  // Using correct table name
      .select('is_booked')
      .eq('id', slotId)
      .single();
    
    if (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
    
    return !data?.is_booked;
  } catch (error) {
    console.error('Error in checkSlotAvailability:', error);
    return false;
  }
};

/**
 * Check if user already has a trial class for this course
 * 
 * @param userId User ID to check
 * @param courseId Course ID to check
 * @returns True if user already has a trial for this course, false otherwise
 */
export const hasTrialForCourse = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    console.log(`Checking if user ${userId} has trial for course ${courseId}`);
    
    const params = {
      user_id: userId,
      course_id: courseId
    };
    
    // Call the has_trial_for_course RPC function
    const { data, error } = await supabase
      .rpc('has_trial_for_course', params);
    
    if (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error in hasTrialForCourse:', error);
    return false;
  }
};

/**
 * Alias for hasTrialForCourse to match expected export
 */
export const checkTrialForCourse = hasTrialForCourse;

/**
 * Fetch available slots for a specific course
 */
export const fetchAvailableSlotsForCourse = async (courseId: string): Promise<AvailabilitySlot[]> => {
  try {
    console.log(`Fetching available slots for course: ${courseId}`);
    
    // Call the get_available_trial_slots RPC function
    const { data, error } = await supabase
      .rpc('get_available_trial_slots', { course_id: courseId });
    
    if (error) {
      console.error('Error fetching available slots:', error);
      return [];
    }
    
    if (!data) {
      console.log('No data returned from get_available_trial_slots');
      return [];
    }
    
    const availableSlots: AvailabilitySlot[] = data.map((slot: any) => ({
      id: slot.id,
      teacherId: slot.teacher_id,
      teacherName: slot.teacher_name,
      startTime: new Date(slot.start_time),
      endTime: new Date(slot.end_time),
      isBooked: slot.is_booked || false,
      courseId: slot.course_id
    }));
    
    console.log(`Found ${availableSlots.length} available slots`);
    return availableSlots;
  } catch (error) {
    console.error('Error in fetchAvailableSlotsForCourse:', error);
    return [];
  }
};
