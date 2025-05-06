
import { supabase } from '@/integrations/supabase/client';
import { Course, ClassTypeData } from '@/types/course';

// Helper to handle type conversion between Json and ClassTypeData[]
const convertJsonClassTypeData = (course: any): Course => {
  return {
    ...course,
    // Ensure class_types_data is properly parsed if it's a string or properly cast if it's already an object
    class_types_data: course.class_types_data ? 
      (typeof course.class_types_data === 'string' 
        ? JSON.parse(course.class_types_data) 
        : course.class_types_data) as ClassTypeData[]
  } as Course;
};

// Create a new course
export async function createCourse(courseData: Partial<Course>): Promise<Course> {
  try {
    // Add creation timestamp
    const data = {
      ...courseData,
      created_at: new Date().toISOString(),
    };
    
    const { data: course, error } = await supabase
      .from('courses')
      .insert([data])
      .select()
      .single();
      
    if (error) throw error;
    return convertJsonClassTypeData(course);
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Convert Json to ClassTypeData[]
    return (data || []).map(convertJsonClassTypeData);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

// Get a single course by ID
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data ? convertJsonClassTypeData(data) : null;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
}

// Update a course
export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
  try {
    // Convert class_types_data to string if it's an array
    const processedUpdates = {
      ...updates
    };
    
    const { data, error } = await supabase
      .from('courses')
      .update(processedUpdates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return convertJsonClassTypeData(data);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

// Delete a course
export async function deleteCourse(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}
