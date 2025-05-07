
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  level: string | null;
  created_at: string;
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
        .from('user_skills')
        .select('*');
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      setUserSkills(data || []);
      
      // Process data for lookups
      const bySkill: Record<string, string[]> = {};
      const byUser: Record<string, string[]> = {};
      
      data?.forEach(item => {
        // Group by skill
        if (!bySkill[item.skill_id]) {
          bySkill[item.skill_id] = [];
        }
        bySkill[item.skill_id].push(item.user_id);
        
        // Group by user
        if (!byUser[item.user_id]) {
          byUser[item.user_id] = [];
        }
        byUser[item.user_id].push(item.skill_id);
      });
      
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
