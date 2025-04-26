
import { ClassTypeData } from '@/types/course';
import { Json } from '@/integrations/supabase/types';

/**
 * Helper function to format class_types_data correctly
 */
export const formatClassTypesData = (data: Json | null): ClassTypeData[] => {
  if (!data) return [];
  
  // If it's already an array, try to cast it
  if (Array.isArray(data)) {
    return data.map(item => {
      // Safely access properties with type checking
      const itemObj = item as Record<string, unknown>;
      return {
        class_type_id: String(itemObj.class_type_id || ''),
        quantity: Number(itemObj.quantity || 0),
        duration_value: itemObj.duration_value ? Number(itemObj.duration_value) : undefined,
        duration_metric: itemObj.duration_metric ? String(itemObj.duration_metric) : undefined,
      };
    });
  }
  
  // If it's a string, try to parse it
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          // Safely access properties with type checking
          const itemObj = item as Record<string, unknown>;
          return {
            class_type_id: String(itemObj.class_type_id || ''),
            quantity: Number(itemObj.quantity || 0),
            duration_value: itemObj.duration_value ? Number(itemObj.duration_value) : undefined,
            duration_metric: itemObj.duration_metric ? String(itemObj.duration_metric) : undefined,
          };
        });
      }
      return [];
    } catch (e) {
      console.error('Error parsing class_types_data string:', e);
      return [];
    }
  }
  
  // If we can't determine what it is, return empty array
  return [];
};
