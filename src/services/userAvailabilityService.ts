
// Re-export all availability functionality through the main service file

import { UserAvailability, UserAvailabilityMap } from './availability/types';
import { mapDbAvailabilitySlot } from './availability/api';
import { 
  fetchUserAvailability,
  fetchUserAvailabilityForDate,
  fetchUserAvailabilityForWeek,
  fetchUserAvailabilityForUsers,
  fetchAllStaffAvailability
} from './availability/api';

import {
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot
} from './availability/api/availabilityCrud';

import { copyDayAvailability } from './availability/availabilityManagement';

// Export types
export type { UserAvailability, UserAvailabilityMap };

// Export all functions
export {
  mapDbAvailabilitySlot,
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
