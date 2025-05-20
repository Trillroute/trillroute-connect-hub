
import { FilterType } from '../types/eventTypes';

/**
 * Map filter type to the corresponding column name for database queries
 */
export function getColumnNameFromFilterType(filterType: FilterType): string | null {
  switch (filterType) {
    case 'course':
      return 'course_id';
    case 'skill':
      return 'skill_id';
    case 'teacher':
    case 'student':
    case 'admin':
    case 'staff':
      return 'user_id';
    default:
      return null;
  }
}
