
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
    const teachersWithSkills = (data || []).filter(teacher => {
      // Ensure skills is an array before attempting to use it
      const teacherSkills = Array.isArray(teacher.skills) ? teacher.skills : [];
      
      if (teacherSkills.length === 0) {
        console.log(`Teacher ${teacher.id} has no skills array or empty skills`);
        return false;
      }
      
      // Check if any of the teacher's skills match our skillIds - improved debugging
      console.log(`Teacher ${teacher.id} has skills:`, teacherSkills);
      
      // More detailed intersection check
      const matchingSkills = skillIds.filter(skillId => teacherSkills.includes(skillId));
      const hasMatch = matchingSkills.length > 0;
      
      console.log(`Teacher ${teacher.id} matching skills: ${matchingSkills.join(', ')} - Match: ${hasMatch ? 'YES' : 'NO'}`);
      
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
    
    // Filter users who have ANY of the requested skills - with improved checking
    const usersWithSkills = (data || []).filter(user => {
      // Ensure skills is a valid array before proceeding
      const userSkills = Array.isArray(user.skills) ? user.skills : [];
      
      // Skip users without skills array
      if (userSkills.length === 0) {
        console.log(`User ${user.id} (${user.role}) has no skills or empty skills array`);
        return false;
      }
      
      // Debug individual user skills
      console.log(`User ${user.id} (${user.first_name} ${user.last_name}, ${user.role}) has skills:`, userSkills);
      
      // More detailed intersection check
      const matchingSkills = skillIds.filter(skillId => userSkills.includes(skillId));
      const hasMatchingSkill = matchingSkills.length > 0;
      
      if (hasMatchingSkill) {
        console.log(`✓ User ${user.id} has matching skills: ${matchingSkills.join(', ')}`);
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

/**
 * Add a skill to a specific user
 * @param userId User ID to add skill to
 * @param skillId Skill ID to add
 * @returns Boolean indicating success
 */
export const addSkillToUser = async (userId: string, skillId: string): Promise<boolean> => {
  try {
    console.log(`Adding skill ${skillId} to user ${userId}`);
    
    // First, get the current skills array for the user
    const { data: userData, error: fetchError } = await supabase
      .from('custom_users')
      .select('skills')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching user skills:', fetchError);
      throw fetchError;
    }
    
    // Ensure we have a valid skills array
    const currentSkills = Array.isArray(userData?.skills) ? userData.skills : [];
    console.log('Current user skills:', currentSkills);
    
    // Check if user already has this skill
    if (currentSkills.includes(skillId)) {
      console.log('User already has this skill');
      return true; // Already done, so return success
    }
    
    // Add the new skill to the array
    const updatedSkills = [...currentSkills, skillId];
    console.log('Updated skills array:', updatedSkills);
    
    // Update the user record
    const { error: updateError } = await supabase
      .from('custom_users')
      .update({ skills: updatedSkills })
      .eq('id', userId);
      
    if (updateError) {
      console.error('Error updating user skills:', updateError);
      throw updateError;
    }
    
    console.log('Successfully added skill to user');
    return true;
    
  } catch (error) {
    console.error('Error in addSkillToUser:', error);
    return false;
  }
};

/**
 * Find a user by name (first name + last name)
 * @param name Full name to search for (first name + last name)
 * @returns User ID if found, null otherwise
 */
export const findUserByName = async (name: string): Promise<string | null> => {
  try {
    console.log(`Searching for user with name: ${name}`);
    
    // Clean up the name for comparison
    const cleanName = name.trim().toLowerCase();
    
    // Get all users
    const { data, error } = await supabase
      .from('custom_users')
      .select('id, first_name, last_name');
      
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // Find the user with matching name (case insensitive)
    const user = data?.find(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return fullName === cleanName;
    });
    
    if (user) {
      console.log(`Found user ${user.first_name} ${user.last_name} with ID ${user.id}`);
      return user.id;
    }
    
    console.log('User not found');
    return null;
    
  } catch (error) {
    console.error('Error in findUserByName:', error);
    return null;
  }
};

/**
 * Find a skill by name
 * @param name Skill name to search for
 * @returns Skill ID if found, null otherwise
 */
export const findSkillByName = async (name: string): Promise<string | null> => {
  try {
    console.log(`Searching for skill with name: ${name}`);
    
    // Clean up the name for comparison
    const cleanName = name.trim().toLowerCase();
    
    // Get all skills
    const { data, error } = await supabase
      .from('skills')
      .select('id, name');
      
    if (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
    
    // Find the skill with matching name (case insensitive)
    const skill = data?.find(skill => 
      skill.name.toLowerCase() === cleanName
    );
    
    if (skill) {
      console.log(`Found skill ${skill.name} with ID ${skill.id}`);
      return skill.id;
    }
    
    console.log('Skill not found');
    return null;
    
  } catch (error) {
    console.error('Error in findSkillByName:', error);
    return null;
  }
};
