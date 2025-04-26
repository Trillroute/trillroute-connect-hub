
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EnrolledCourse } from '@/types/student-dashboard';
import { Course } from '@/types/course';

export function useEnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get courses where the student is enrolled
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .contains('student_ids', [user.id]);

        if (error) {
          console.error('Error fetching enrolled courses:', error);
          setEnrolledCourses([]);
          setLoading(false);
          return;
        }

        // Format the courses as EnrolledCourse objects
        const formatted = data.map((course: Course): EnrolledCourse => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image: course.image || '/placeholder.svg',
          progress: Math.floor(Math.random() * 100), // This would be replaced with actual progress tracking
          instructors: course.instructor_ids || [],
          nextLessonDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toISOString(),
        }));

        setEnrolledCourses(formatted);
      } catch (error) {
        console.error('Unexpected error fetching enrolled courses:', error);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  return { enrolledCourses, loading };
}
