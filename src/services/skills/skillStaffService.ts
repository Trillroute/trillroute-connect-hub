
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
    
    // Debug full data set before filtering
    console.log(`Total teachers found: ${data?.length || 0}`);
    
    // Filter teachers who have ANY of the requested skills
    const teachersWithSkills = data?.filter(teacher => {
      if (!Array.isArray(teacher.skills)) {
        console.log(`Teacher ${teacher.id} has no skills array`);
        return false;
      }
      
      // Check if any of the teacher's skills match our skillIds
      const hasMatch = skillIds.some(skillId => teacher.skills.includes(skillId));
      console.log(`Teacher ${teacher.id} has skills: ${teacher.skills.join(', ')}`);
      console.log(`Matching requested skills: ${hasMatch ? 'YES' : 'NO'}`);
      
      return hasMatch;
    }).map(teacher => teacher.id) || [];
    
    console.log(`Found ${teachersWithSkills.length} teachers with requested skills:`, teachersWithSkills);
    
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
    
    console.log('==== FETCHING USERS BY SKILLS ====');
    console.log('Skill IDs:', skillIds);
    console.log('Roles filter:', roles || 'none');
    
    // We need to properly debug the query
    let query = supabase
      .from('custom_users')
      .select('id, skills, role, first_name, last_name');
      
    // Add role filter if specified
    if (roles && roles.length > 0) {
      query = query.in('role', roles);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching users by skill:', error);
      throw error;
    }

    // Debug users and their skills
    console.log(`Total users fetched: ${data?.length || 0}`);
    
    // Filter users who have ANY of the requested skills
    const usersWithSkills = data?.filter(user => {
      // Skip users without skills array
      if (!user.skills || !Array.isArray(user.skills) || user.skills.length === 0) {
        console.log(`User ${user.id} (${user.role}) has no skills`);
        return false;
      }
      
      // Debug individual user skills
      console.log(`User ${user.id} (${user.first_name} ${user.last_name}, ${user.role}) has skills:`, user.skills);
      
      // Check if any of the user's skills match our skillIds
      const hasMatchingSkill = skillIds.some(skillId => user.skills.includes(skillId));
      
      if (hasMatchingSkill) {
        console.log(`✓ User ${user.id} has at least one of the requested skills`);
      } else {
        console.log(`✗ User ${user.id} has no matching skills`);
      }
      
      return hasMatchingSkill;
    }).map(user => user.id) || [];
    
    console.log(`Found ${usersWithSkills.length} users with requested skills:`, usersWithSkills);
    
    return usersWithSkills;
  } catch (error) {
    console.error('Error in getUsersBySkills:', error);
    return [];
  }
};
