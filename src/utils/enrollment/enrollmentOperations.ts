
import { supabase } from '@/integrations/supabase/client';

/**
 * Enrolls a student in a course
 */
export const enrollStudentInCourse = async (
  studentId: string, 
  courseId: string
): Promise<boolean> => {
  try {
    // First check if the course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, student_ids, students')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error fetching course for enrollment:', courseError);
      return false;
    }
    
    if (!course) {
      console.error('Course not found for enrollment');
      return false;
    }
    
    // Check if student is already enrolled
    const studentIds = Array.isArray(course.student_ids) ? course.student_ids : [];
    
    if (studentIds.includes(studentId)) {
      console.warn('Student already enrolled in this course');
      return true; // Already enrolled is considered success
    }
    
    // Add student to course
    const updatedStudentIds = [...studentIds, studentId];
    const updatedStudentCount = (course.students || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: updatedStudentIds,
        students: updatedStudentCount
      })
      .eq('id', courseId);
    
    if (updateError) {
      console.error('Error enrolling student in course:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in enrollStudentInCourse:', error);
    return false;
  }
};

/**
 * Unenrolls a student from a course
 */
export const unenrollStudentFromCourse = async (
  studentId: string, 
  courseId: string
): Promise<boolean> => {
  try {
    // Get the course first
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, student_ids, students')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error fetching course for unenrollment:', courseError);
      return false;
    }
    
    if (!course) {
      console.error('Course not found for unenrollment');
      return false;
    }
    
    // Check if student is enrolled
    const studentIds = Array.isArray(course.student_ids) ? course.student_ids : [];
    
    if (!studentIds.includes(studentId)) {
      console.warn('Student not enrolled in this course');
      return true; // Already not enrolled is considered success
    }
    
    // Remove student from course
    const updatedStudentIds = studentIds.filter(id => id !== studentId);
    const updatedStudentCount = Math.max(0, (course.students || 1) - 1);
    
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: updatedStudentIds,
        students: updatedStudentCount
      })
      .eq('id', courseId);
    
    if (updateError) {
      console.error('Error unenrolling student from course:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in unenrollStudentFromCourse:', error);
    return false;
  }
};
