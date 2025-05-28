
import { supabase } from '@/integrations/supabase/client';

export const calculateEventDuration = async (courseId: string): Promise<number> => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('class_types_data')
      .eq('id', courseId)
      .single();

    if (error || !course) {
      console.log('Could not fetch course class types, using default duration');
      return 60; // Default 60 minutes
    }

    const classTypesData = course.class_types_data;
    
    if (!Array.isArray(classTypesData) || classTypesData.length === 0) {
      console.log('No class types data found, using default duration');
      return 60;
    }

    const firstClassType = classTypesData[0];
    
    if (!firstClassType || typeof firstClassType !== 'object' || !('class_type_id' in firstClassType)) {
      console.log('Invalid class type data structure, using default duration');
      return 60;
    }

    const classTypeId = String(firstClassType.class_type_id);

    const { data: classType, error: classTypeError } = await supabase
      .from('class_types')
      .select('duration_value, duration_metric')
      .eq('id', classTypeId)
      .single();

    if (classTypeError || !classType) {
      console.log('Could not fetch class type details, using default duration');
      return 60;
    }

    const { duration_value, duration_metric } = classType;
    let durationInMinutes = duration_value || 60;

    switch (duration_metric) {
      case 'hours':
        durationInMinutes = duration_value * 60;
        break;
      case 'days':
        durationInMinutes = duration_value * 24 * 60;
        break;
      case 'weeks':
        durationInMinutes = duration_value * 7 * 24 * 60;
        break;
      case 'months':
        durationInMinutes = duration_value * 30 * 24 * 60;
        break;
      default:
        durationInMinutes = duration_value;
    }

    console.log(`Calculated event duration: ${durationInMinutes} minutes for course ${courseId}`);
    return durationInMinutes;
  } catch (error) {
    console.error('Error calculating event duration:', error);
    return 60;
  }
};
