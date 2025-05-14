
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

/**
 * Check course enrollment limit
 */
export const checkCourseHasSpace = async (courseId: string): Promise<boolean> => {
  try {
    // Get the course with its current enrollment count and max students
    const { data, error } = await supabase
      .from('courses')
      .select('students, class_types_data')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error checking course capacity:', error);
      return false;
    }
    
    // Get max students from class types data
    const classTypesData = data.class_types_data || [];
    let maxStudents = 0;
    
    if (Array.isArray(classTypesData) && classTypesData.length > 0) {
      // Use the highest max_students value from all class types
      maxStudents = classTypesData.reduce((max, classType) => {
        const classTypeMaxStudents = classType.max_students || 0;
        return Math.max(max, classTypeMaxStudents);
      }, 0);
    }
    
    // If maxStudents is still 0, assume unlimited capacity
    if (maxStudents === 0) {
      return true;
    }
    
    // Check if there's space available
    const currentStudents = data.students || 0;
    return currentStudents < maxStudents;
  } catch (error) {
    console.error('Error in checkCourseHasSpace:', error);
    return false;
  }
};
