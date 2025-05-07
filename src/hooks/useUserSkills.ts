
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserSkill {
  user_id: string;
  skill_id: string;
  level?: string | null;
}

interface UseUserSkillsResult {
  userSkills: UserSkill[];
  usersBySkill: Record<string, string[]>;
  skillsByUser: Record<string, string[]>;
  loading: boolean;
  error: Error | null;
  refetchUserSkills: () => Promise<void>;
}

export function useUserSkills(): UseUserSkillsResult {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [usersBySkill, setUsersBySkill] = useState<Record<string, string[]>>({});
  const [skillsByUser, setSkillsByUser] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('custom_users')
        .select('id, skills')
        .not('skills', 'is', null);
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      // Transform the data to match the previous structure
      const transformedData: UserSkill[] = [];
      const bySkill: Record<string, string[]> = {};
      const byUser: Record<string, string[]> = {};
      
      data?.forEach((user) => {
        if (user.skills && user.skills.length > 0) {
          // Add each skill for this user to our transformed data
          user.skills.forEach((skillId: string) => {
            transformedData.push({
              user_id: user.id,
              skill_id: skillId
            });
            
            // Group by skill
            if (!bySkill[skillId]) {
              bySkill[skillId] = [];
            }
            bySkill[skillId].push(user.id);
          });
          
          // Group by user
          byUser[user.id] = user.skills;
        }
      });
      
      setUserSkills(transformedData);
      setUsersBySkill(bySkill);
      setSkillsByUser(byUser);
      
    } catch (err) {
      console.error('Error fetching user skills:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user skills'));
      toast({
        title: 'Error',
        description: 'Failed to load user skills.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  return {
    userSkills,
    usersBySkill,
    skillsByUser,
    loading,
    error,
    refetchUserSkills: fetchUserSkills
  };
}
