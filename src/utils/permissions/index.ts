
// Export all permission-related functionality from a single entry point

// Types
export * from './types';

// Core permission checking
export * from './permissionCheck';
export * from './modulePermissions';
export * from './accessControl';  // This import now points to the .tsx file

// Helper functions
export * from './roleHelpers';
export * from './permissionCache';
export * from './fallbackRoles';
