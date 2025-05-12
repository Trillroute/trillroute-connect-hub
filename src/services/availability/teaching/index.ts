
// Re-export all teaching availability functionality

export * from './types';
export * from './mappers';
export * from './availabilityManagement';
export { hasTrialForCourse } from './availabilityQuery'; 
export { bookTrialClass, cancelTrialClass, checkTrialForCourse } from './trialBooking';
