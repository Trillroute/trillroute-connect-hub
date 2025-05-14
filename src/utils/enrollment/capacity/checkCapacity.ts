
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { parseMaxStudents } from '../utils/parseJsonValues';

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
    const maxStudents = parseMaxStudents(classTypesData);
    
    // If maxStudents is still 0, assume unlimited capacity
    if (maxStudents === 0) {
      return true;
    }
    
    // Check if there's space available
    let currentStudents = 0;
    
    if (typeof data.students === 'number') {
      currentStudents = data.students;
    } else if (typeof data.students === 'string') {
      currentStudents = parseInt(data.students, 10) || 0;
    } else {
      // Handle any other potential type
      currentStudents = 0;
    }
      
    return currentStudents < maxStudents;
  } catch (error) {
    console.error('Error in checkCourseHasSpace:', error);
    return false;
  }
};

/**
 * Check if a class has reached its maximum capacity
 * @param classId 
 * @returns 
 */
export async function isClassAtCapacity(classId: string): Promise<boolean> {
  try {
    // Get the class data from the courses table
    const { data, error } = await supabase
      .from('courses')
      .select('*, class_types_data, student_ids')
      .eq('id', classId)
      .single();
    
    if (error || !data) {
      console.error('Error checking class capacity:', error);
      return false;
    }
    
    // Count enrolled students from student_ids array
    const enrolledStudentIds = data.student_ids || [];
    const currentEnrollment = Array.isArray(enrolledStudentIds) ? enrolledStudentIds.length : 0;
    
    // Get max students from class types data
    const classTypesData = data.class_types_data || [];
    const maxStudents = parseMaxStudents(classTypesData);
    
    // If no max students specified or zero, assume unlimited capacity
    if (maxStudents <= 0) {
      return false;
    }
    
    // Check if current enrollment meets or exceeds maximum
    return currentEnrollment >= maxStudents;
  } catch (error) {
    console.error('Error in isClassAtCapacity:', error);
    return false;
  }
}
