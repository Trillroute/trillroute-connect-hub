
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";

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
        setMyCourses(data || []);
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
