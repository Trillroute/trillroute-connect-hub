
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
        
        // Fetch courses to get their instructor_ids
        const { data: courses, error } = await supabase
          .from('courses')
          .select('id, instructor_ids')
          .in('id', courseIds);
          
        if (error) {
          console.error('Error fetching courses with instructor_ids:', error);
          toast({
            title: 'Error',
            description: 'Failed to load course instructor data.',
            variant: 'destructive',
          });
          return;
        }
        
        // Build instructor map from courses data
        if (Array.isArray(courses)) {
          courses.forEach(course => {
            if (course && course.id) {
              // Ensure instructor_ids is always treated as an array
              const instructorIds = course.instructor_ids || [];
              instructorsMap[course.id] = Array.isArray(instructorIds) ? instructorIds : [];
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
