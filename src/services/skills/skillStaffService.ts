
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Get users that have specific skills
 * @param skillIds - Array of skill IDs
 * @param roleFilter - Optional array of roles to filter by
 * @returns Array of user IDs
 */
export const getUsersBySkills = async (
  skillIds: string[] = [],
  roleFilter: string[] = []
): Promise<string[]> => {
  try {
    console.log(`Getting users with skills: [${skillIds.join(', ')}], role filter: [${roleFilter.join(', ')}]`);
    
    if (!skillIds.length) {
      console.log('No skill IDs provided, returning empty array');
      return [];
    }

    // Call the database function to get users with these skills
    const { data, error } = await supabase.rpc('get_users_with_skills', {
      skill_ids: skillIds,
      role_filter: roleFilter.length > 0 ? roleFilter.join(',') : null as unknown as string
    });

    if (error) {
      console.error('Error fetching users with skills:', error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`No users found with skills [${skillIds.join(', ')}]`);
      return [];
    }

    console.log(`Found ${data.length} users with the requested skills`);
    return (data as any[]).map((user: any) => user.id);
  } catch (error) {
    console.error('Error in getUsersBySkills:', error);
    return [];
  }
};

/**
 * Seed user skills for testing purposes (DEV ONLY)
 */
export const seedUserSkills = async (): Promise<boolean> => {
  try {
    console.log('Seeding user skills for testing...');

    // Call the database function to seed user skills
    const { data, error } = await supabase.rpc('seed_skill_data', {
      param_name: null as unknown as string
    });

    if (error) {
      console.error('Error seeding user skills:', error);
      toast({
        title: "Error",
        description: "Failed to seed skill data for testing.",
        variant: "destructive"
      });
      return false;
    }

    console.log('Successfully seeded user skills for testing', data);
    
    if (data && Array.isArray(data) && (data as any[]).length > 0) {
      toast({
        title: "Development Mode",
        description: `Created ${(data as any[]).length} skill assignments for testing.`
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in seedUserSkills:', error);
    return false;
  }
};
