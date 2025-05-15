
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
    
    // Create a direct SQL query to find teachers with skills - more reliable than filtering in JS
    const { data, error } = await supabase.rpc('get_users_with_skills', { 
      skill_ids: skillIds,
      role_filter: 'teacher'
    });
      
    if (error) {
      console.error('Error in RPC call to get_users_with_skills:', error);
      
      // Fallback to the old method if the RPC fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('custom_users')
        .select('id, skills')
        .eq('role', 'teacher');
        
      if (fallbackError) {
        console.error('Error in fallback query:', fallbackError);
        return [];
      }
      
      // Filter teachers who have ANY of the requested skills
      const teachersWithSkills = fallbackData?.filter(teacher => {
        if (!Array.isArray(teacher.skills) || teacher.skills.length === 0) return false;
        return skillIds.some(skillId => teacher.skills.includes(skillId));
      }).map(teacher => teacher.id) || [];
      
      console.log(`Fallback found ${teachersWithSkills.length} teachers with requested skills`);
      return teachersWithSkills;
    }
    
    console.log(`RPC found ${data?.length || 0} teachers with requested skills:`, data);
    return data || [];
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

    // First try the more efficient RPC method
    if (roles && roles.length > 0) {
      const { data, error } = await supabase.rpc('get_users_with_skills', { 
        skill_ids: skillIds,
        role_filter: roles.join(',')
      });
      
      if (!error && data) {
        console.log(`RPC found ${data.length} users with requested skills:`, data);
        return data;
      }
      
      console.warn('RPC method failed, falling back to direct query:', error);
    }
    
    // Fallback to direct query - SQL ARRAY functions don't work well with filters
    // So we'll use a raw query approach to find users whose skills array overlaps with our skill IDs
    let query = supabase
      .from('custom_users')
      .select('id, first_name, last_name, role, skills');
      
    // Add role filter if specified
    if (roles && roles.length > 0) {
      query = query.in('role', roles);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching users by skill:', error);
      throw error;
    }

    console.log(`Total users fetched: ${data?.length || 0}`);
    
    // Manually check each user's skills array for ANY matching skill
    const usersWithSkills = data?.filter(user => {
      // Skip users without skills array
      if (!user.skills || !Array.isArray(user.skills)) {
        console.log(`User ${user.id} (${user.role}) has no skills array`);
        return false;
      }
      
      // Debug user skills
      console.log(`User ${user.id} (${user.first_name} ${user.last_name}, ${user.role}) has skills:`, user.skills);
      
      // Check if ANY of the user's skills match our skillIds using array intersection
      const hasMatchingSkill = user.skills.some(userSkill => 
        skillIds.includes(userSkill)
      );
      
      if (hasMatchingSkill) {
        console.log(`✓ MATCH: User ${user.id} has at least one of the requested skills`);
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

/**
 * Seed skills data for testing (development only)
 */
export const seedUserSkills = async (): Promise<void> => {
  try {
    console.log('Checking for users to seed skills data...');
    
    // Get all teachers that don't have skills yet
    const { data: teachers, error } = await supabase
      .from('custom_users')
      .select('id, skills')
      .eq('role', 'teacher')
      .is('skills', null);
      
    if (error) {
      console.error('Error checking for users to seed:', error);
      return;
    }
    
    if (!teachers || teachers.length === 0) {
      console.log('No teachers found that need skills seeding');
      return;
    }
    
    // Get all available skills
    const { data: skills } = await supabase
      .from('skills')
      .select('id');
      
    if (!skills || skills.length === 0) {
      console.log('No skills found for seeding');
      return;
    }
    
    const skillIds = skills.map(skill => skill.id);
    
    // For each teacher, assign 1-3 random skills
    for (const teacher of teachers) {
      const randomSkills = getRandomItems(skillIds, Math.floor(Math.random() * 3) + 1);
      
      const { error: updateError } = await supabase
        .from('custom_users')
        .update({ skills: randomSkills })
        .eq('id', teacher.id);
        
      if (updateError) {
        console.error(`Error seeding skills for teacher ${teacher.id}:`, updateError);
      } else {
        console.log(`Seeded skills for teacher ${teacher.id}:`, randomSkills);
      }
    }
    
    console.log('Skills seeding completed');
  } catch (error) {
    console.error('Error in seedUserSkills:', error);
  }
};

// Helper function to get random items from an array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
