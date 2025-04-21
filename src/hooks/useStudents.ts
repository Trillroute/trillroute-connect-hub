
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_users')
        .select('id, first_name, last_name, email')
        .eq('role', 'student');

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students. Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      // Log the fetched data to help with debugging
      console.log('Students fetched successfully:', data?.length || 0);
      
      setStudents(data || []);
    } catch (error) {
      console.error('Unexpected error fetching students:', error);
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
    fetchStudents();
    
    const subscription = supabase
      .channel('custom_users_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_users' }, (payload) => {
        if (payload.new && (payload.new as any).role === 'student') {
          fetchStudents();
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { students, loading, fetchStudents };
}
