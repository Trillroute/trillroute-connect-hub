
import { supabase } from '@/integrations/supabase/client';
import { Course, ClassTypeData } from '@/types/course';
import { Json } from '@/integrations/supabase/types';
import { formatClassTypesData } from '@/utils/courseHelpers';

// Create a new course
export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  // Make sure required fields are present for the insert
  if (!courseData.title || !courseData.description) {
    throw new Error('Course title and description are required');
  }
  
  // Convert class_types_data to JSON string if it exists
  const dataToInsert = {
    ...courseData,
    class_types_data: courseData.class_types_data ? JSON.stringify(courseData.class_types_data) : null,
    // Explicitly include required fields
    title: courseData.title,
    description: courseData.description
  };
  
  const { data, error } = await supabase
    .from('courses')
    .insert(dataToInsert)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    class_types_data: formatClassTypesData(data.class_types_data)
  } as Course;
};

// Update an existing course
export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
  // Convert class_types_data to JSON string if it exists
  const dataToUpdate = {
    ...courseData,
    class_types_data: courseData.class_types_data ? JSON.stringify(courseData.class_types_data) : undefined
  };
  
  const { data, error } = await supabase
    .from('courses')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    class_types_data: formatClassTypesData(data.class_types_data)
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
    class_types_data: formatClassTypesData(data.class_types_data)
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
    class_types_data: formatClassTypesData(course.class_types_data)
  })) as Course[];
};
