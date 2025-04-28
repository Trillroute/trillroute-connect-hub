
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
 * Checks if a student is enrolled in a course using multiple verification methods
 */
export const isStudentEnrolledInCourse = async (courseId: string, studentId: string): Promise<boolean> => {
  if (!courseId || !studentId) {
    console.error('Missing courseId or studentId in isStudentEnrolledInCourse');
    return false;
  }
  
  try {
    console.log(`Checking if student ${studentId} is enrolled in course ${courseId}`);
    
    // Method 1: Check course.student_ids array
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error checking enrollment via course data:', courseError);
      // Try alternative method if this one fails
    } else {
      const isEnrolledViaCourseData = courseData && 
                      courseData.students > 0 && 
                      Array.isArray(courseData.student_ids) && 
                      courseData.student_ids.includes(studentId);
      
      if (isEnrolledViaCourseData) {
        console.log('User is enrolled based on course.student_ids check');
        return true;
      }
    }
    
    // If we have payment confirmation in session storage, consider the user enrolled
    // This helps when there's a lag between payment and database update
    const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
    if (paymentDataStr) {
      try {
        const paymentData = JSON.parse(paymentDataStr);
        if (paymentData.courseId === courseId && 
            paymentData.userId === studentId && 
            paymentData.completed === true &&
            paymentData.enrollmentCompleted === true) {
          console.log('User is enrolled based on payment session data');
          return true;
        }
      } catch (error) {
        console.error('Error parsing payment data:', error);
      }
    }

    console.log('User is not enrolled after all verification methods');
    
    // If we reach this point, user is not enrolled
    return false;
  } catch (error) {
    console.error('Unexpected error checking enrollment:', error);
    return false;
  }
};
