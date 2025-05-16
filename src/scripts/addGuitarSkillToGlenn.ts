
import { findUserByName, findSkillByName, addSkillToUser } from '@/services/skills/skillStaffService';
import { toast } from '@/components/ui/use-toast';

/**
 * Adds the guitar skill to Glenn's user profile
 */
export const addGuitarSkillToGlenn = async () => {
  try {
    // Find Glenn's user ID
    const glennId = await findUserByName("Glenn Rogers");
    if (!glennId) {
      toast({
        title: "User not found",
        description: "Could not find a user named Glenn Rogers",
        variant: "destructive"
      });
      return false;
    }
    
    // Find Guitar skill ID
    const guitarSkillId = await findSkillByName("Guitar");
    if (!guitarSkillId) {
      toast({
        title: "Skill not found",
        description: "Could not find a skill named Guitar",
        variant: "destructive"
      });
      return false;
    }
    
    // Add the skill to Glenn
    const success = await addSkillToUser(glennId, guitarSkillId);
    
    if (success) {
      toast({
        title: "Skill added",
        description: "Successfully added Guitar skill to Glenn Rogers"
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to add Guitar skill to user",
        variant: "destructive"
      });
      return false;
    }
    
  } catch (error) {
    console.error('Error adding guitar skill to Glenn:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
