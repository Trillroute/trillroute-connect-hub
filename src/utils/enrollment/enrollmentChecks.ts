
import { supabase } from '@/integrations/supabase/client';

/**
 * Verifies if a user has a student role
 */
export const verifyStudentRole = async (studentId: string): Promise<boolean> => {
  const { data: userData, error: userError } = await supabase
    .from('custom_users')
    .select('role')
    .eq('id', studentId)
    .single();

  if (userError) {
    console.error('Error fetching user role:', userError);
    return false;
  }

  return userData.role === 'student';
};

/**
 * Checks if a student is enrolled in a course
 */
export const isStudentEnrolledInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  if (!courseId || !studentId) {
    console.error('Missing courseId or studentId in isStudentEnrolledInCourse');
    return false;
  }
  
  try {
    console.log(`Checking if student ${studentId} is enrolled in course ${courseId}`);
    
    const { data, error } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }

    const isEnrolled = data.students > 0 && 
                      Array.isArray(data.student_ids) && 
                      data.student_ids.includes(studentId);
                      
    console.log(`Enrollment check result: ${isEnrolled}`);
    return isEnrolled;
  } catch (error) {
    console.error('Unexpected error checking enrollment:', error);
    return false;
  }
};
