
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
        // First check if we need to fetch from course_instructors table or use instructor_ids from courses table
        const { data: coursesWithInstructors, error: coursesError } = await supabase
          .from('courses')
          .select('id, instructor_ids')
          .in('id', courseIds);
          
        if (coursesError) {
          console.error('Error fetching courses with instructor_ids:', coursesError);
          toast({
            title: 'Error',
            description: 'Failed to load course instructor data.',
            variant: 'destructive',
          });
          return;
        }
        
        // Build instructor map from courses data
        const instructorsMap: Record<string, string[]> = {};
        coursesWithInstructors?.forEach(course => {
          if (course.id) {
            instructorsMap[course.id] = Array.isArray(course.instructor_ids) ? course.instructor_ids : [];
          }
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
