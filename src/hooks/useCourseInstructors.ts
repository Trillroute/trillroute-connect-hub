
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCourseInstructors(courseIds: string[]) {
  const [courseInstructorsMap, setCourseInstructorsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseInstructors = async () => {
      if (!courseIds.length) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('course_instructors')
          .select('course_id, instructor_id')
          .in('course_id', courseIds);
          
        if (error) {
          console.error('Error fetching course instructors:', error);
          toast({
            title: 'Error',
            description: 'Failed to load course instructor data.',
            variant: 'destructive',
          });
          return;
        }
        
        // Group instructors by course ID
        const instructorsMap: Record<string, string[]> = {};
        data.forEach(item => {
          if (!instructorsMap[item.course_id]) {
            instructorsMap[item.course_id] = [];
          }
          instructorsMap[item.course_id].push(item.instructor_id);
        });
        
        setCourseInstructorsMap(instructorsMap);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseInstructors();
  }, [courseIds, toast]);

  return { courseInstructorsMap, loading };
}
