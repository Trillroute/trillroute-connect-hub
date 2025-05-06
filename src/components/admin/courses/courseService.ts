
import { supabase } from '@/integrations/supabase/client';
import { Course, ClassTypeData } from '@/types/course';

// Create a new course
export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .insert(courseData)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    class_types_data: (typeof data.class_types_data === 'string' 
      ? JSON.parse(data.class_types_data) 
      : data.class_types_data) as ClassTypeData[]
  } as Course;
};

// Update an existing course
export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    class_types_data: (typeof data.class_types_data === 'string' 
      ? JSON.parse(data.class_types_data) 
      : data.class_types_data) as ClassTypeData[]
  } as Course;
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Fetch a course by ID
export const fetchCourseById = async (id: string): Promise<Course> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    class_types_data: (typeof data.class_types_data === 'string' 
      ? JSON.parse(data.class_types_data) 
      : data.class_types_data) as ClassTypeData[]
  } as Course;
};

// Fetch all courses
export const fetchAllCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data.map(course => ({
    ...course,
    class_types_data: (typeof course.class_types_data === 'string' 
      ? JSON.parse(course.class_types_data) 
      : course.class_types_data) as ClassTypeData[]
  })) as Course[];
};
