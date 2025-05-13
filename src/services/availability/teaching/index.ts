
// Re-export all teaching availability functionality

export * from './types';
export * from './mappers';

// Export from availabilityQuery
export { checkSlotAvailability } from './availabilityQuery';

// Export from trialBooking (excluding createAvailabilitySlot which is also in availabilityManagement)
export { 
  fetchAvailableSlotsForCourse, 
  hasTrialForCourse,
  bookTrialClass,
  cancelTrialClass
} from './trialBooking';

// Export from availabilityManagement
export { createAvailabilitySlot } from './availabilityManagement';
