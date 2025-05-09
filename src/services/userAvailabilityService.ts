
// Re-export all availability functionality through the main service file

import { UserAvailability, UserAvailabilityMap } from './availability/types';
import { mapDbAvailability } from './availability/types';
import { 
  fetchUserAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchUserAvailabilityForUsers
} from './availability/availabilityApi';
import { fetchAllStaffAvailability } from './availability/staffAvailabilityApi';
import { copyDayAvailability } from './availability/availabilityManagement';

// Export types
export type { UserAvailability, UserAvailabilityMap };

// Export all functions
export {
  mapDbAvailability,
  fetchUserAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchUserAvailabilityForUsers,
  fetchAllStaffAvailability,
  copyDayAvailability
};
