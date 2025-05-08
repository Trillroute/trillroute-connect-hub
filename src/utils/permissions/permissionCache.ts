
import { AdminLevel, RolesCache } from './types';

// In-memory cache for admin roles
let rolesCache: RolesCache = {};
let userPermissionsCache: { [userId: string]: { [permission: string]: boolean } } = {};

/**
 * Update the cached admin roles
 */
export const updateCachedAdminRoles = (roles: AdminLevel[]) => {
  // Clear existing cache
  rolesCache = {};
  
  // Update with new roles
  roles.forEach(role => {
    rolesCache[role.name] = role;
  });
  
  console.log('[PermissionsCache] Updated admin roles cache with', roles.length, 'roles');
};

/**
 * Get an admin role by name from the cache
 */
export const getCachedAdminRole = (roleName: string): AdminLevel | undefined => {
  return rolesCache[roleName];
};

/**
 * Clear permissions cache for a specific user
 */
export const clearPermissionsCache = (userId: string) => {
  if (userPermissionsCache[userId]) {
    delete userPermissionsCache[userId];
    console.log('[PermissionsCache] Cleared permissions cache for user', userId);
  }
};

/**
 * Clear all permissions caches
 */
export const clearAllPermissionsCaches = () => {
  userPermissionsCache = {};
  console.log('[PermissionsCache] Cleared all permissions caches');
};
