import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
