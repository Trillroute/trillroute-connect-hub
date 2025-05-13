
// This file is now a barrel file that re-exports from the refactored modules
import { useUserAvailability } from './availability/useAvailabilityHook';
import { DayAvailability } from './availability/types';

// Re-export
export { useUserAvailability };
export type { DayAvailability };
