
/**
 * @deprecated This file is being refactored into smaller files.
 * Please import from '@/services/calendar' instead.
 */

export {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  mapToDbEvent,
  mapFromDbEvent
} from './calendar';

// Export types to maintain backward compatibility
export type { DbEvent } from './calendar';
