import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";
import { ClassTypeData } from '@/types/course';

export function useTeacherCourses() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "teacher") return;
    const fetchMyCourses = async () => {
      setMyCoursesLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .contains("instructor_ids", [user.id]);

        if (error) {
          console.error('Error fetching my classes:', error);
          setMyCourses([]);
          setMyCoursesLoading(false);
          return;
        }

        const formattedCourses = data.map(course => ({
          ...course,
          student_ids: course.student_ids || [],
          instructor_ids: course.instructor_ids || [],
          class_types_data: course.class_types_data ? 
            (Array.isArray(course.class_types_data) ? 
              course.class_types_data as ClassTypeData[] : 
              []) : 
            [],
        }));

        setMyCourses(formattedCourses);
      } catch (err) {
        console.error('Unexpected error fetching my classes:', err);
        setMyCourses([]);
      } finally {
        setMyCoursesLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  return { myCourses, myCoursesLoading };
}
