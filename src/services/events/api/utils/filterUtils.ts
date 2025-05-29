
import { FilterType } from '../types/eventTypes';

/**
 * Map filter type to the corresponding column name for database queries
 */
export function getColumnNameFromFilterType(filterType: FilterType): string | null {
  switch (filterType) {
    case 'course':
      return 'course_id'; // This will be used as metadata->course_id
    case 'skill':
      return 'skill_id'; // This will be used as metadata->skill_id
    case 'teacher':
      return 'teacher_id'; // This will be used as metadata->teacher_id for teacher-specific events
    case 'student':
      return 'student_id'; // This will be used as metadata->student_id for student-specific events
    case 'admin':
    case 'staff':
      return 'user_id'; // These use the direct user_id column
    default:
      return null;
  }
}

/**
 * Check if the filter type should use metadata filtering
 */
export function usesMetadataFiltering(filterType: FilterType): boolean {
  return ['course', 'skill', 'teacher', 'student'].includes(filterType || '');
}

/**
 * Check if the filter type should use direct user_id filtering
 */
export function usesDirectUserFiltering(filterType: FilterType): boolean {
  return ['admin', 'staff'].includes(filterType || '');
}
