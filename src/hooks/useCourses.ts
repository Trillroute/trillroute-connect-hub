
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

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
          classes_count: item.classes_count || 0,
          classes_duration: item.classes_duration || 0,
          studio_sessions_count: item.studio_sessions_count || 0,
          studio_sessions_duration: item.studio_sessions_duration || 0,
          practical_sessions_count: item.practical_sessions_count || 0,
          practical_sessions_duration: item.practical_sessions_duration || 0,
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
