
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCourseInstructors(courseIds: string[]) {
  const [courseInstructorsMap, setCourseInstructorsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseInstructors = async () => {
      // Ensure courseIds is an array and not empty
      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        setLoading(false);
        setCourseInstructorsMap({});
        return;
      }
      
      try {
        setLoading(true);
        const instructorsMap: Record<string, string[]> = {};
        
        // Fetch from course_instructors table instead of directly from courses
        const { data: courseInstructors, error } = await supabase
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
        if (Array.isArray(courseInstructors)) {
          courseInstructors.forEach(relation => {
            if (relation && relation.course_id) {
              if (!instructorsMap[relation.course_id]) {
                instructorsMap[relation.course_id] = [];
              }
              if (relation.instructor_id) {
                instructorsMap[relation.course_id].push(relation.instructor_id);
              }
            }
          });
        }
        
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
