
import { useState, useEffect } from 'react';
import { useTeachers } from '@/hooks/useTeachers';
import { useToast } from '@/hooks/use-toast';

export function useCourseInstructors(courseIds: string[]) {
  const [courseInstructorsMap, setCourseInstructorsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { teachers } = useTeachers();

  useEffect(() => {
    const mapInstructorsForCourses = async () => {
      // Ensure courseIds is an array and not empty
      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        setLoading(false);
        setCourseInstructorsMap({});
        return;
      }
      
      try {
        setLoading(true);
        
        // Get the instructor_ids from the courses in the app state
        // and create a map of course_id -> instructor_ids
        const instructorsMap: Record<string, string[]> = {};
        
        // Use data already in the app or from props - no need to query DB
        courseIds.forEach(courseId => {
          // Default to empty array - this will be populated by course data
          instructorsMap[courseId] = [];
        });
        
        setCourseInstructorsMap(instructorsMap);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    mapInstructorsForCourses();
  }, [courseIds, toast]);

  return { courseInstructorsMap, loading };
}
