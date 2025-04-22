
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, ClassTypeData } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load courses. Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        // Ensure all courses have the correct shape and required fields
        const formattedCourses = data.map(item => ({
          ...item,
          instructor_ids: item.instructor_ids || [],
          student_ids: item.student_ids || [],
          class_types_data: item.class_types_data ? 
            // Properly cast the Json to ClassTypeData[]
            (Array.isArray(item.class_types_data) ? 
              (item.class_types_data as unknown as ClassTypeData[]) : 
              []) : 
            [],
        }));

        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error('Unexpected error fetching courses:', error);
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
    fetchCourses();
    
    // Add subscription to refresh when course data changes
    const subscription = supabase
      .channel('courses_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchCourses();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { courses, loading, fetchCourses };
}
