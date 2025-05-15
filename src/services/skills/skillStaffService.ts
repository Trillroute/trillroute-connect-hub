
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches staff (teachers) associated with specific skills
 * @param skillIds Array of skill IDs
 * @returns Array of staff user IDs
 */
export const fetchStaffForSkill = async (skillIds: string[]): Promise<string[]> => {
  try {
    if (!skillIds.length) return [];
    
    console.log('Fetching staff for skills:', skillIds);
    
    // Query custom_users table to get teachers with these skills
    const { data, error } = await supabase
      .from('custom_users')
      .select('id, skills')
      .eq('role', 'teacher');
      
    if (error) {
      console.error('Error fetching teachers by skill:', error);
      throw error;
    }
    
    // Filter teachers who have ANY of the requested skills
    const teachersWithSkills = data?.filter(teacher => {
      if (!Array.isArray(teacher.skills)) return false;
      
      // Check if any of the teacher's skills match our skillIds
      return skillIds.some(skillId => teacher.skills.includes(skillId));
    }).map(teacher => teacher.id) || [];
    
    console.log(`Found ${teachersWithSkills.length} teachers with requested skills:`, skillIds);
    
    return teachersWithSkills;
  } catch (error) {
    console.error('Error in fetchStaffForSkill:', error);
    return [];
  }
};

/**
 * Get users who have specific skill IDs
 * @param skillIds Array of skill IDs
 * @param roles Optional array of roles to filter by
 * @returns Array of user IDs
 */
export const getUsersBySkills = async (skillIds: string[], roles?: string[]): Promise<string[]> => {
  try {
    if (!skillIds.length) return [];
    
    console.log('Fetching users with skills:', skillIds, 'roles filter:', roles || 'none');
    
    let query = supabase
      .from('custom_users')
      .select('id, skills');
      
    // Add role filter if specified
    if (roles && roles.length > 0) {
      query = query.in('role', roles);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching users by skill:', error);
      throw error;
    }
    
    // Filter users who have ANY of the requested skills
    const usersWithSkills = data?.filter(user => {
      if (!Array.isArray(user.skills)) return false;
      
      // Check if any of the user's skills match our skillIds
      return skillIds.some(skillId => user.skills.includes(skillId));
    }).map(user => user.id) || [];
    
    console.log(`Found ${usersWithSkills.length} users with requested skills:`, skillIds);
    
    return usersWithSkills;
  } catch (error) {
    console.error('Error in getUsersBySkills:', error);
    return [];
  }
};
