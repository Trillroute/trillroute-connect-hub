
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches staff (teachers) associated with specific courses
 * @param courseIds Array of course IDs
 * @returns Array of staff user IDs
 */
export const fetchStaffForCourse = async (courseIds: string[]): Promise<string[]> => {
  try {
    if (!courseIds.length) return [];
    
    // Query courses table to get instructor_ids for these courses
    const { data, error } = await supabase
      .from('courses')
      .select('instructor_ids')
      .in('id', courseIds);
      
    if (error) {
      console.error('Error fetching course staff:', error);
      throw error;
    }
    
    // Extract and flatten all instructor IDs
    const instructorIds = data?.reduce<string[]>((acc, course) => {
      if (Array.isArray(course.instructor_ids)) {
        return [...acc, ...course.instructor_ids];
      }
      return acc;
    }, []) || [];
    
    // Remove duplicates
    return [...new Set(instructorIds)];
  } catch (error) {
    console.error('Error in fetchStaffForCourse:', error);
    return [];
  }
};
