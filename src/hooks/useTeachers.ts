
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Teacher } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      console.log('Fetching teachers...');
      const { data, error } = await supabase
        .from('custom_users')
        .select('id, first_name, last_name, email')
        .eq('role', 'teacher');
      
      if (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load teachers. Please try again later.',
          variant: 'destructive',
        });
        return;
      }
      
      // Ensure we have a valid array of teachers and log to understand the structure
      const validTeachers = Array.isArray(data) ? data : [];
      console.log('Teachers data fetched:', validTeachers);
      console.log('Teacher data structure example:', validTeachers.length > 0 ? validTeachers[0] : 'No teachers found');
      
      // Make sure all required fields exist on each teacher
      const processedTeachers = validTeachers.map(teacher => ({
        id: teacher.id || '',
        first_name: teacher.first_name || '',
        last_name: teacher.last_name || '',
        email: teacher.email || ''
      }));
      
      setTeachers(processedTeachers);
    } catch (error) {
      console.error('Unexpected error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    
    // Add subscription to refresh when teacher data changes
    const subscription = supabase
      .channel('custom_users_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_users' }, () => {
        fetchTeachers();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Always ensure we return a valid array even if teachers is somehow nullish
  return { teachers: teachers || [], loading };
}
