
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Teacher } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

export function useCourseTeachers(courseId: string | null) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!courseId) {
      setTeachers([]);
      return;
    }

    const fetchCourseTeachers = async () => {
      setLoading(true);
      try {
        // First get the instructor_ids from the selected course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('instructor_ids')
          .eq('id', courseId)
          .single();
        
        if (courseError) {
          console.error('Error fetching course instructors:', courseError);
          setTeachers([]);
          setLoading(false);
          return;
        }

        // If no instructors assigned or empty array
        const instructorIds = courseData?.instructor_ids;
        if (!instructorIds || instructorIds.length === 0) {
          setTeachers([]);
          setLoading(false);
          return;
        }

        // Fetch the actual teacher data for these IDs
        const { data: teachersData, error: teachersError } = await supabase
          .from('custom_users')
          .select('id, first_name, last_name, email')
          .eq('role', 'teacher')
          .in('id', instructorIds);
        
        if (teachersError) {
          console.error('Error fetching teachers data:', teachersError);
          setTeachers([]);
        } else {
          setTeachers(teachersData as Teacher[]);
        }
      } catch (error) {
        console.error('Unexpected error in useCourseTeachers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load course teachers',
          variant: 'destructive',
        });
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseTeachers();
  }, [courseId, toast]);

  return { teachers, loading };
}
