
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { updateTeacherSkillsForCourse } from '@/services/skills/teacherSkillUpdater';
import { Json } from '@/integrations/supabase/types';
import { formatClassTypesData } from '@/utils/courseHelpers';

// Helper function to prepare course data for Supabase
const prepareCourseDataForDb = (courseData: Partial<Course>) => {
  const { class_types_data, ...rest } = courseData;
  
  // Return a properly typed object with class_types_data converted to JSON
  return {
    ...rest,
    // Convert ClassTypeData[] to Json for storage
    class_types_data: class_types_data ? JSON.parse(JSON.stringify(class_types_data)) : null
  };
};

export const createCourse = async (courseData: Partial<Course>): Promise<{ data: Course | null, error: Error | null }> => {
  try {
    // Validate required fields are present for course creation
    if (!courseData.title || !courseData.description || !courseData.level || 
        !courseData.skill || !courseData.image || !courseData.duration) {
      console.error('Missing required fields for course creation');
      return { data: null, error: new Error('Missing required fields for course creation') };
    }
    
    // Create a prepared data object while preserving the original courseData structure
    const preparedData = prepareCourseDataForDb(courseData);
    
    const { data, error } = await supabase
      .from('courses')
      .insert(preparedData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating course:', error);
      return { data: null, error };
    }
    
    // Process the returned data to match Course type
    const processedCourse: Course = {
      ...data,
      class_types_data: formatClassTypesData(data.class_types_data),
      instructor_ids: data.instructor_ids || [],
      student_ids: data.student_ids || [],
    } as Course;
    
    // After course creation, update teacher skills
    if (processedCourse && processedCourse.id) {
      try {
        await updateTeacherSkillsForCourse(processedCourse.id);
      } catch (skillError) {
        console.error('Error updating teacher skills after course creation:', skillError);
        // Don't fail the course creation if skill update fails
      }
    }
    
    return { data: processedCourse, error: null };
  } catch (error) {
    console.error('Unexpected error creating course:', error);
    return { data: null, error: error as Error };
  }
};

export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // Create a prepared data object while preserving the original courseData structure
    const preparedData = prepareCourseDataForDb(courseData);
    
    const { error } = await supabase
      .from('courses')
      .update(preparedData)
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
