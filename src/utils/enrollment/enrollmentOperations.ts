
import { supabase } from '@/integrations/supabase/client';
import { isStudentEnrolledInCourse } from './enrollmentChecks';

/**
 * Force verify if a student is enrolled in a course by checking the database directly
 */
export const forceVerifyEnrollment = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    return await isStudentEnrolledInCourse(userId, courseId);
  } catch (error) {
    console.error('Error verifying enrollment:', error);
    return false;
  }
};

/**
 * Enroll a student in a course
 */
export const enrollStudentInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    // First check if the user is already enrolled
    const isEnrolled = await isStudentEnrolledInCourse(userId, courseId);
    
    if (isEnrolled) {
      console.log('User is already enrolled in this course');
      return true;
    }
    
    // Get the current student_ids array for the course
    const { data, error } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error getting course data:', error);
      return false;
    }
    
    // Add the student to the array if not already present
    const studentIds = Array.isArray(data.student_ids) ? data.student_ids : [];
    if (!studentIds.includes(userId)) {
      studentIds.push(userId);
    }
    
    // Update the students count
    const newStudentsCount = data.students + 1;
    
    // Update the course with the new student_ids array and students count
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: studentIds,
        students: newStudentsCount
      })
      .eq('id', courseId);
    
    if (updateError) {
      console.error('Error updating course:', updateError);
      return false;
    }
    
    console.log('Student successfully enrolled in the course');
    return true;
  } catch (error) {
    console.error('Error in enrollStudentInCourse:', error);
    return false;
  }
};
