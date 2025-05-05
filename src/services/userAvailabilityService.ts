
// Re-export all availability functionality through the main service file
// This maintains backward compatibility with existing imports

import { UserAvailability, UserAvailabilityMap, mapDbAvailability } from './availability/types';
import { 
  fetchUserAvailability,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot
} from './availability/availabilityApi';
import { fetchAllStaffAvailability } from './availability/staffAvailabilityApi';
import { copyDayAvailability } from './availability/availabilityManagement';

// Export types
export type { UserAvailability, UserAvailabilityMap };

// Export all functions
export {
  mapDbAvailability,
  fetchUserAvailability,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchAllStaffAvailability,
  copyDayAvailability
};
