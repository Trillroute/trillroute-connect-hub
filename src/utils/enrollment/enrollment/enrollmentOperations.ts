
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { isStudentEnrolledInCourse } from './enrollmentQueries';
import { checkCourseHasSpace } from '../capacity/checkCapacity';

/**
 * Enrolls a student in a course by adding their ID to the course's student_ids array
 */
export const enrollStudentInCourse = async (
  courseId: string,
  studentId: string
): Promise<boolean> => {
  try {
    // First, get current student_ids
    const { data: courseData, error: fetchError } = await supabase
      .from('courses')
      .select('student_ids')
      .eq('id', courseId)
      .single();

    if (fetchError) {
      console.error('Error fetching course data:', fetchError);
      return false;
    }

    // Create an array of student IDs (or empty array if none exist)
    const currentStudentIds = courseData.student_ids || [];
    
    // Check if student is already enrolled
    if (currentStudentIds.includes(studentId)) {
      console.log('Student already enrolled in this course');
      return true;
    }
    
    // Add the new student ID to the array
    const updatedStudentIds = [...currentStudentIds, studentId];
    
    // Update the course with the new student_ids array
    const { error: updateError } = await supabase
      .from('courses')
      .update({ 
        student_ids: updatedStudentIds,
        students: updatedStudentIds.length
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error enrolling student:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in enrollStudentInCourse:', error);
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
