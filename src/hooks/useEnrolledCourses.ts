
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EnrolledCourse } from '@/types/student-dashboard';
import { Course } from '@/types/course';
import { formatClassTypesData } from '@/utils/courseHelpers';
import { toast } from 'sonner';

export function useEnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) {
      setEnrolledCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching enrolled courses for user:', user.id);
      
      // Get courses where the student is enrolled
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .contains('student_ids', [user.id]);

      if (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to load your courses', {
          description: 'Please refresh the page to try again'
        });
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }

      console.log('Enrolled courses data:', data?.length || 0, 'courses found');
      
      if (!data || data.length === 0) {
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }

      // Format the courses as EnrolledCourse objects
      const formatted: EnrolledCourse[] = data.map((courseData): EnrolledCourse => {
        // Process course data safely
        const course = {
          ...courseData,
          instructor_ids: courseData.instructor_ids || [],
          student_ids: courseData.student_ids || [],
          class_types_data: formatClassTypesData(courseData.class_types_data),
        } as unknown as Course;
        
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          image: course.image || '/placeholder.svg',
          imageUrl: course.image || '/placeholder.svg',
          progress: Math.floor(Math.random() * 100), // This would be replaced with actual progress tracking
          instructors: course.instructor_ids || [],
          instructor: course.instructor_ids && course.instructor_ids.length > 0 ? course.instructor_ids[0] : 'Unknown',
          nextLessonDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toISOString(),
          nextLesson: new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toLocaleDateString()
        };
      });

      console.log('Formatted enrolled courses:', formatted);
      setEnrolledCourses(formatted);
    } catch (error) {
      console.error('Unexpected error fetching enrolled courses:', error);
      toast.error('Failed to load your courses', {
        description: 'An unexpected error occurred'
      });
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  return { 
    enrolledCourses, 
    loading,
    refreshCourses: fetchEnrolledCourses  // Expose the fetch function to allow manual refreshes
  };
}
