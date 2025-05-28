
import { supabase } from '@/integrations/supabase/client';
import { CourseDetails, UserDetails } from '../types/calendarEventTypes';

export const fetchCourseDetails = async (courseId: string): Promise<CourseDetails | null> => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('title, duration, course_type, skill, level, instructor_ids')
      .eq('id', courseId)
      .single();

    if (error || !course) {
      console.error('Error fetching course details:', error);
      return null;
    }

    return course;
  } catch (error) {
    console.error('Error in fetchCourseDetails:', error);
    return null;
  }
};

export const fetchUserDetails = async (userId: string): Promise<UserDetails | null> => {
  try {
    const { data: user, error } = await supabase
      .from('custom_users')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.error('Error fetching user details:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in fetchUserDetails:', error);
    return null;
  }
};
