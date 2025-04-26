
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

/**
 * Enrolls a student in a course by updating the course's student_ids array
 * and incrementing the students count
 */
export const enrollStudentInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  console.log(`Attempting to enroll student ${studentId} in course ${courseId}`);
  
  try {
    // First, check if student is already enrolled
    const isAlreadyEnrolled = await isStudentEnrolledInCourse(courseId, studentId);
    if (isAlreadyEnrolled) {
      console.log('Student is already enrolled in this course');
      return true;
    }
    
    // If not enrolled, fetch the current course data
    const { data: courseData, error: fetchError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (fetchError) {
      console.error('Error fetching course data:', fetchError);
      toast.error('Failed to enroll in course', {
        description: 'There was an error processing your enrollment.'
      });
      return false;
    }

    console.log('Current course data:', courseData);
    
    // Add student to the course
    const currentStudentIds = courseData.student_ids || [];
    const newStudentIds = [...currentStudentIds, studentId];
    const newStudentCount = (courseData.students || 0) + 1;

    console.log(`Updating course with new student. New count: ${newStudentCount}`);
    
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: newStudentIds,
        students: newStudentCount
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course with enrollment:', updateError);
      toast.error('Enrollment Failed', {
        description: 'There was an error processing your enrollment.'
      });
      return false;
    }

    // Log the user activity
    await logUserActivity(studentId, 'enrollment', 'Enrolled in course', courseId);
    console.log('Enrollment successful');
    
    return true;
  } catch (error) {
    console.error('Unexpected error during enrollment:', error);
    toast.error('Enrollment Error', {
      description: 'An unexpected error occurred. Please try again.'
    });
    return false;
  }
};

/**
 * Unenrolls a student from a course
 */
export const unenrollStudentFromCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  try {
    // First, fetch the current course data
    const { data: courseData, error: fetchError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (fetchError) {
      console.error('Error fetching course data:', fetchError);
      toast.error('Failed to unenroll from course', {
        description: 'There was an error processing your request.'
      });
      return false;
    }

    // Check if student is enrolled
    const currentStudentIds = courseData.student_ids || [];
    if (!currentStudentIds.includes(studentId)) {
      toast.info('Not Enrolled', {
        description: 'You are not enrolled in this course.'
      });
      return true;
    }

    // Remove student from the course
    const newStudentIds = currentStudentIds.filter(id => id !== studentId);
    const newStudentCount = Math.max((courseData.students || 0) - 1, 0); // Ensure count doesn't go below 0

    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: newStudentIds,
        students: newStudentCount
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course with unenrollment:', updateError);
      toast.error('Unenrollment Failed', {
        description: 'There was an error processing your request.'
      });
      return false;
    }

    // Log the user activity
    await logUserActivity(studentId, 'unenrollment', 'Unenrolled from course', courseId);

    return true;
  } catch (error) {
    console.error('Unexpected error during unenrollment:', error);
    toast.error('Unenrollment Error', {
      description: 'An unexpected error occurred. Please try again.'
    });
    return false;
  }
};

/**
 * Logs user activity to the database
 */
const logUserActivity = async (
  userId: string,
  action: string,
  component: string,
  entityId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        component,
        page_url: window.location.pathname,
        entity_id: entityId
      });

    if (error) {
      console.error('Error logging user activity:', error);
    }
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
};

/**
 * Checks if a student is enrolled in a course
 */
export const isStudentEnrolledInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  console.log(`Checking if student ${studentId} is enrolled in course ${courseId}`);
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('student_ids')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }

    const isEnrolled = data.student_ids?.includes(studentId) || false;
    console.log(`Enrollment check result: ${isEnrolled}`);
    return isEnrolled;
  } catch (error) {
    console.error('Unexpected error checking enrollment:', error);
    return false;
  }
};
