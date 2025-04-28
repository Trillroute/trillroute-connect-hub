
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
 * Checks if a student is enrolled in a course using multiple verification methods.
 * This function has been enhanced to make database verification the source of truth.
 */
export const isStudentEnrolledInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  if (!courseId || !studentId) {
    console.error('Missing courseId or studentId in isStudentEnrolledInCourse');
    return false;
  }
  
  try {
    console.log(`Checking if student ${studentId} is enrolled in course ${courseId}`);
    
    // The primary and most reliable method: Check course.student_ids array
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error checking enrollment via course data:', courseError);
      // Don't proceed with alternative methods on DB error to avoid false positives
      return false;
    }
    
    // Verify student_ids is an array and the student ID is included
    const isEnrolledViaCourseData = courseData && 
                  Array.isArray(courseData.student_ids) && 
                  courseData.student_ids.includes(studentId);
    
    if (isEnrolledViaCourseData) {
      console.log('User is enrolled based on course.student_ids check');
      return true;
    }
    
    // If not enrolled according to the database, cache this result to avoid using stale session data
    sessionStorage.setItem(`enrollment_${courseId}_${studentId}`, JSON.stringify({
      enrolled: false,
      timestamp: Date.now()
    }));
    
    console.log('User is not enrolled after verification with database');
    return false;
    
  } catch (error) {
    console.error('Unexpected error checking enrollment:', error);
    return false;
  }
};

/**
 * Verifies enrollment by forcing a fresh database check and cleaning any session storage
 * that might be causing false enrollment status
 */
export const forceVerifyEnrollment = async (courseId: string, studentId: string): Promise<boolean> => {
  try {
    // Clear any cached enrollment data in session storage
    sessionStorage.removeItem(`enrollment_${courseId}_${studentId}`);
    sessionStorage.removeItem(`payment_${courseId}`);
    
    // Perform a direct database check
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error in force verification of enrollment:', courseError);
      return false;
    }
    
    const isEnrolled = courseData && 
                      Array.isArray(courseData.student_ids) && 
                      courseData.student_ids.includes(studentId);
    
    console.log(`Force enrollment verification result for ${studentId} in course ${courseId}: ${isEnrolled}`);
    return isEnrolled;
  } catch (error) {
    console.error('Unexpected error during force enrollment verification:', error);
    return false;
  }
};
