
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FilterOption } from './FilterOptionsSelector';

export const useFilterOptions = (filterType: string | null) => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!filterType) {
      setFilterOptions([]);
      return;
    }

    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        let data: FilterOption[] = [];

        switch (filterType) {
          case 'course':
            const { data: courses, error: coursesError } = await supabase
              .from('courses')
              .select('id, title as name');
            
            if (coursesError) throw coursesError;
            data = courses || [];
            break;

          case 'skill':
            const { data: skills, error: skillsError } = await supabase
              .from('skills')
              .select('id, name');
            
            if (skillsError) throw skillsError;
            data = skills || [];
            break;

          case 'teacher':
          case 'student':
          case 'admin':
            const { data: users, error: usersError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name')
              .eq('role', filterType === 'admin' ? 'admin' : filterType);
            
            if (usersError) throw usersError;
            data = (users || []).map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`
            }));
            break;

          default:
            data = [];
        }

        setFilterOptions(data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        toast({
          title: 'Error',
          description: 'Failed to load filter options',
          variant: 'destructive'
        });
        setFilterOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, [filterType, toast]);

  return { filterOptions, loading };
};
