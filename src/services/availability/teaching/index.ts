// Re-export all teaching availability functionality

export * from './types';
export * from './mappers';
// Export from availabilityManagement but avoid duplicating createAvailabilitySlot
export { 
  
} from './availabilityManagement';

// Export from availabilityQuery but avoid duplicate exports with trialBooking
export { 
  checkSlotAvailability
} from './availabilityQuery'; 

// Export all from trialBooking which includes createAvailabilitySlot, fetchAvailableSlotsForCourse, hasTrialForCourse
export * from './trialBooking';
