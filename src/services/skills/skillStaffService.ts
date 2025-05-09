
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches staff (teachers) associated with specific skills
 * @param skillIds Array of skill IDs
 * @returns Array of staff user IDs
 */
export const fetchStaffForSkill = async (skillIds: string[]): Promise<string[]> => {
  try {
    if (!skillIds.length) return [];
    
    // Query custom_users table to get teachers with these skills
    const { data, error } = await supabase
      .from('custom_users')
      .select('id, skills')
      .eq('role', 'teacher');
      
    if (error) {
      console.error('Error fetching teachers by skill:', error);
      throw error;
    }
    
    // Filter teachers who have any of the requested skills
    const teachersWithSkills = data?.filter(teacher => {
      if (!Array.isArray(teacher.skills)) return false;
      
      // Check if any of the teacher's skills match our skillIds
      return teacher.skills.some(skillId => skillIds.includes(skillId));
    }).map(teacher => teacher.id) || [];
    
    return teachersWithSkills;
  } catch (error) {
    console.error('Error in fetchStaffForSkill:', error);
    return [];
  }
};
