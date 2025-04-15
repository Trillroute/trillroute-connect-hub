
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
      console.log('Fetching courses...');
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
      
      console.log('Courses data fetched:', data);
      
      // Process and standardize all courses - handle instructor_ids
      const typedCourses = (data || []).map(course => {
        // Create a properly typed course object with default values where needed
        const processedCourse: Course = {
          ...course,
          status: course.status === 'Active' || course.status === 'Draft' 
            ? course.status 
            : 'Draft',
          instructor_ids: Array.isArray(course.instructor_ids) ? course.instructor_ids : [],
          skill: course.skill || ''
        };
        return processedCourse;
      });
      
      setCourses(typedCourses);
    } catch (error) {
      console.error('Unexpected error:', error);
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
    
    const coursesSubscription = supabase
      .channel('public:courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
        console.log('Change received in courses:', payload);
        fetchCourses();
      })
      .subscribe();
      
    return () => {
      coursesSubscription.unsubscribe();
    };
  }, []);

  return { courses, loading, fetchCourses };
}
