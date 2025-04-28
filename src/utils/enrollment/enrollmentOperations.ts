
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { verifyStudentRole, isStudentEnrolledInCourse } from './enrollmentChecks';
import { logUserActivity } from '../activity/activityLogger';

/**
 * Enrolls a student in a course by updating the course's student_ids array
 * and incrementing the students count. Only allows student role to enroll.
 */
export const enrollStudentInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  console.log(`Enrolling student ${studentId} in course ${courseId}`);
  
  try {
    // Verify that the user has a student role
    const isStudent = await verifyStudentRole(studentId);
    if (!isStudent) {
      console.error('User is not a student');
      toast.error('Enrollment Failed', {
        description: 'Only students can enroll in courses.'
      });
      return false;
    }
    
    // Check if student is already enrolled
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
    const newStudentCount = Math.max((courseData.students || 0) - 1, 0);

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
