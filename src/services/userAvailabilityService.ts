
// Re-export all availability functionality through the main service file

import { UserAvailability, UserAvailabilityMap } from './availability/types';
import { mapDbAvailability } from './availability/types';
import { 
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  fetchUserAvailabilityForUsers
} from './availability/availabilityApi';
import { fetchAllStaffAvailability } from './availability/staffAvailabilityApi';
import { copyDayAvailability } from './availability/availabilityManagement';

// Export types
export type { UserAvailability, UserAvailabilityMap };

// Export all functions
export {
  mapDbAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  fetchUserAvailabilityForUsers,
  fetchAllStaffAvailability,
  copyDayAvailability
};
