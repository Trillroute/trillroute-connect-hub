
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
      maxStudents = classTypesData.reduce((max: number, classType: any) => {
        // Handle different types safely
        let classTypeMaxStudents = 0;
        
        if (classType && typeof classType === 'object' && 'max_students' in classType) {
          if (typeof classType.max_students === 'number') {
            classTypeMaxStudents = classType.max_students;
          } else if (typeof classType.max_students === 'string') {
            classTypeMaxStudents = parseInt(classType.max_students, 10) || 0;
          }
        }
          
        return Math.max(max, classTypeMaxStudents);
      }, 0);
    }
    
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
 * Force verify enrollment for a student in a course
 */
export const forceVerifyEnrollment = async (
  courseId: string,
  userId: string
): Promise<boolean> => {
  try {
    // First check if already enrolled
    const isEnrolled = await isStudentEnrolledInCourse(userId, courseId);
    
    if (isEnrolled) {
      console.log('User is already enrolled in this course');
      return true;
    }
    
    // Check if the course has space
    const hasSpace = await checkCourseHasSpace(courseId);
    
    if (!hasSpace) {
      console.error('Course is full, cannot enroll more students');
      return false;
    }
    
    // Get the course to update its student_ids array
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();
      
    if (courseError) {
      console.error('Error getting course data:', courseError);
      return false;
    }
    
    // Add student to the course's student_ids array
    const studentIds = Array.isArray(courseData.student_ids) ? [...courseData.student_ids] : [];
    
    if (!studentIds.includes(userId)) {
      studentIds.push(userId);
    }
    
    // Increment the students count
    let currentStudents = 0;
    
    if (typeof courseData.students === 'number') {
      currentStudents = courseData.students;
    } else if (typeof courseData.students === 'string') {
      currentStudents = parseInt(courseData.students, 10) || 0;
    }
    
    const updatedStudentsCount = currentStudents + 1;
    
    // Update the course
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: studentIds,
        students: updatedStudentsCount
      })
      .eq('id', courseId);
      
    if (updateError) {
      console.error('Error updating course:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in forceVerifyEnrollment:', error);
    return false;
  }
};
