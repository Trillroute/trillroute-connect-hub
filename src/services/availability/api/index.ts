
// Re-export all availability functionality
export * from './userAvailability';
export * from './availabilityCore';
// Export staffAvailability functions with explicit names to avoid conflicts
export { 
  fetchAllStaffAvailability,
  fetchUserAvailabilityForUsers as fetchStaffAvailabilityForUsers
} from './staffAvailability';
export * from './availabilityCrud';
export * from './multiUserAvailability';
