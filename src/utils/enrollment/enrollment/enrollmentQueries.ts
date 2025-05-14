
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a student is enrolled in a course
 */
export const isStudentEnrolledInCourse = async (
  studentId: string, 
  courseId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('student_ids')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
    
    // Check if studentId is in the student_ids array
    const studentIds = Array.isArray(data.student_ids) ? data.student_ids : [];
    return studentIds.includes(studentId);
  } catch (error) {
    console.error('Error in isStudentEnrolledInCourse:', error);
    return false;
  }
};

/**
 * Get all courses a student is enrolled in
 */
export const getStudentEnrolledCourses = async (
  studentId: string
): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, student_ids')
      .contains('student_ids', [studentId]);
    
    if (error) {
      console.error('Error getting enrolled courses:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Return the course IDs
    return data.map(course => course.id);
  } catch (error) {
    console.error('Error in getStudentEnrolledCourses:', error);
    return [];
  }
};
