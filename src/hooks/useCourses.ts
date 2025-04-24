
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course, ClassTypeData } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

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
          student_ids: item.student_ids || [],
          class_types_data: formatClassTypesData(item.class_types_data),
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

  // Helper function to format class_types_data correctly
  const formatClassTypesData = (data: Json | null): ClassTypeData[] => {
    if (!data) return [];
    
    // If it's already an array, try to cast it
    if (Array.isArray(data)) {
      return data as ClassTypeData[];
    }
    
    // If it's a string, try to parse it
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing class_types_data string:', e);
        return [];
      }
    }
    
    // If we can't determine what it is, return empty array
    return [];
  };

  const getCourseById = async (id: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course by ID:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          instructor_ids: data.instructor_ids || [],
          student_ids: data.student_ids || [],
          class_types_data: formatClassTypesData(data.class_types_data),
        };
      }
      return null;
    } catch (error) {
      console.error('Unexpected error fetching course by ID:', error);
      return null;
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

  return { courses, loading, fetchCourses, getCourseById };
}
