
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { Json } from '@/integrations/supabase/types';

/**
 * Create a new course record in the database
 */
export const createCourse = async (courseData: {
  title: string;
  description: string;
  image: string;
  duration: string;
  class_types_data: string;
  id?: string;
  level: string; // Make sure level is required
  students?: number;
  skill?: string;
  duration_type?: string;
  created_at?: string;
  base_price?: number;
  instructor_ids?: string[];
  student_ids?: string[];
  discount_value?: number;
  discount_metric?: string;
  discount_validity?: string;
  discount_code?: string;
  category?: string;
}): Promise<Course> => {
  try {
    console.log('Creating course with data:', courseData);
    
    // Parse class_types_data if it's a string
    let parsedClassTypesData: Json = null;
    if (typeof courseData.class_types_data === 'string') {
      try {
        parsedClassTypesData = JSON.parse(courseData.class_types_data);
      } catch (e) {
        console.error('Error parsing class_types_data:', e);
        throw new Error('Invalid class types data format');
      }
    } else {
      parsedClassTypesData = courseData.class_types_data as unknown as Json;
    }
    
    // Create a new object with the correct format for insertion
    const courseRecord = {
      title: courseData.title,
      description: courseData.description,
      image: courseData.image,
      duration: courseData.duration,
      class_types_data: parsedClassTypesData,
      level: courseData.level,
      skill: courseData.skill || '',
      duration_type: courseData.duration_type || 'fixed',
      base_price: courseData.base_price || 0,
      instructor_ids: courseData.instructor_ids || [],
      student_ids: courseData.student_ids || [],
      discount_value: courseData.discount_value,
      discount_metric: courseData.discount_metric,
      discount_validity: courseData.discount_validity,
      discount_code: courseData.discount_code,
      category: courseData.category
    };

    const { data, error } = await supabase
      .from('courses')
      .insert(courseRecord)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw new Error(error.message);
    }

    console.log('Course created successfully:', data);
    return data as Course;
  } catch (error: any) {
    console.error('Unexpected error creating course:', error);
    throw error;
  }
};

/**
 * Update an existing course in the database
 */
export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating course:', error);
      throw new Error(error.message);
    }

    return data as Course;
  } catch (error: any) {
    console.error('Unexpected error updating course:', error);
    throw error;
  }
};

/**
 * Delete a course from the database
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Unexpected error deleting course:', error);
    throw error;
  }
};
