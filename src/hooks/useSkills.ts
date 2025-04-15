
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Skill = {
  id: string;
  name: string;
  created_at: string;
};

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching skills:', error);
          toast({
            title: 'Error',
            description: 'Failed to load skills data.',
            variant: 'destructive',
          });
          // Even in case of error, initialize skills as empty array
          setSkills([]);
          return;
        }
        
        // Ensure data is an array, default to empty array if null or undefined
        setSkills(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
        // Ensure skills is an empty array in case of any error
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
    
    const skillsSubscription = supabase
      .channel('public:skills')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, (payload) => {
        console.log('Change received in skills:', payload);
        fetchSkills();
      })
      .subscribe();
      
    return () => {
      skillsSubscription.unsubscribe();
    };
  }, [toast]);

  return { skills, loading };
}
