
import { supabase } from '@/integrations/supabase/client';
import { updateTeacherSkillsForCourse } from './teacherSkillUpdater';

/**
 * Updates teacher skills when they are assigned to a course
 * @param courseId The course ID
 * @param teacherIds Array of teacher IDs being assigned to the course
 * @returns Promise resolving to boolean indicating success
 */
export const updateSkillsForTeacherAssignment = async (
  courseId: string, 
  teacherIds: string[]
): Promise<boolean> => {
  try {
    if (!courseId || !teacherIds || teacherIds.length === 0) {
      console.log('No course ID or teacher IDs provided for skill update');
      return false;
    }
    
    console.log(`Updating skills for ${teacherIds.length} teachers assigned to course ${courseId}`);
    
    // Update all teachers' skills for this course
    return await updateTeacherSkillsForCourse(courseId);
    
  } catch (error) {
    console.error('Error updating skills for teacher assignment:', error);
    return false;
  }
};
