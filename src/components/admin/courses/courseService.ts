
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { updateTeacherSkillsForCourse } from '@/services/skills/teacherSkillUpdater';

export const createCourse = async (courseData: Partial<Course>): Promise<{ data: Course | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating course:', error);
      return { data: null, error };
    }
    
    // After course creation, update teacher skills
    if (data && data.id) {
      try {
        await updateTeacherSkillsForCourse(data.id);
      } catch (skillError) {
        console.error('Error updating teacher skills after course creation:', skillError);
        // Don't fail the course creation if skill update fails
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating course:', error);
    return { data: null, error: error as Error };
  }
};

export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<{ success: boolean, error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId);
      
    if (error) {
      console.error('Error updating course:', error);
      return { success: false, error };
    }
    
    // After course update, update teacher skills
    try {
      await updateTeacherSkillsForCourse(courseId);
    } catch (skillError) {
      console.error('Error updating teacher skills after course update:', skillError);
      // Don't fail the course update if skill update fails
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error updating course:', error);
    return { success: false, error: error as Error };
  }
};
