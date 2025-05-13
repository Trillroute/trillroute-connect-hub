
// Re-export all teaching availability functionality

export * from './types';
export * from './mappers';
export * from './availabilityManagement';
// Export from availabilityQuery but avoid duplicate exports with trialBooking
export { 
  checkSlotAvailability 
} from './availabilityQuery'; 
export * from './trialBooking';
