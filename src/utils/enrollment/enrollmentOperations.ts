
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Enrolls a student in a course by adding their ID to the course's student_ids array
 */
export const enrollStudentInCourse = async (
  studentId: string,
  courseId: string
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
 * Force verify enrollment for testing and admin purposes
 * This will bypass payment checks and directly enroll a student
 */
export const forceVerifyEnrollment = async (
  courseId: string,
  studentId?: string
): Promise<boolean> => {
  if (!studentId) {
    console.error('Student ID is required for enrollment');
    toast({
      title: 'Enrollment Failed',
      description: 'User identification is required for enrollment.',
      variant: 'destructive'
    });
    return false;
  }
  
  try {
    const success = await enrollStudentInCourse(studentId, courseId);
    
    if (success) {
      toast({
        title: 'Enrollment Successful',
        description: 'You have been enrolled in this course.',
      });
      return true;
    } else {
      toast({
        title: 'Enrollment Failed',
        description: 'There was a problem with the enrollment process.',
        variant: 'destructive'
      });
      return false;
    }
  } catch (error) {
    console.error('Force enrollment error:', error);
    toast({
      title: 'Enrollment Error',
      description: 'An unexpected error occurred during enrollment.',
      variant: 'destructive'
    });
    return false;
  }
};
