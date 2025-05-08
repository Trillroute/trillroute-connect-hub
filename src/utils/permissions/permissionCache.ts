
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
 * Get cached role - alias for getCachedAdminRole for backward compatibility
 */
export const getCachedRole = (roleName: string): AdminLevel | undefined => {
  return getCachedAdminRole(roleName);
};

/**
 * Check if a permission exists in cache
 */
export const hasCachedPermission = (cacheKey: string): boolean => {
  const [userId, permission] = cacheKey.split(':');
  return userId in userPermissionsCache && permission in userPermissionsCache[userId];
};

/**
 * Get a permission from cache
 */
export const getCachedPermission = (cacheKey: string): boolean | undefined => {
  const [userId, permission] = cacheKey.split(':');
  return userPermissionsCache[userId]?.[permission];
};

/**
 * Set a permission in cache
 */
export const setCachedPermission = (cacheKey: string, value: boolean): void => {
  const [userId, permission] = cacheKey.split(':');
  if (!userPermissionsCache[userId]) {
    userPermissionsCache[userId] = {};
  }
  userPermissionsCache[userId][permission] = value;
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
