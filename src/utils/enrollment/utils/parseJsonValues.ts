
import type { Json } from '@/integrations/supabase/types';

/**
 * Parses max_students from class types data safely
 * @param classTypesData Array of class types
 * @returns maximum student value as number
 */
export function parseMaxStudents(classTypesData: any[]): number {
  let maxStudents = 0;
  
  if (Array.isArray(classTypesData) && classTypesData.length > 0) {
    // Use the highest max_students value from all class types
    maxStudents = classTypesData.reduce((max: number, classType: any) => {
      // Handle different types safely
      let classTypeMaxStudents = 0;
      
      if (classType && typeof classType === 'object' && 'max_students' in classType) {
        const maxStudentsValue: Json = classType.max_students;
        
        if (typeof maxStudentsValue === 'number') {
          classTypeMaxStudents = maxStudentsValue;
        } else if (typeof maxStudentsValue === 'string') {
          classTypeMaxStudents = parseInt(maxStudentsValue, 10) || 0;
        } else if (maxStudentsValue !== null && maxStudentsValue !== undefined) {
          // Convert any other JSON value to number via string
          classTypeMaxStudents = parseInt(String(maxStudentsValue), 10) || 0;
        }
      }
        
      return Math.max(max, classTypeMaxStudents);
    }, 0);
  }
  
  return maxStudents;
}
