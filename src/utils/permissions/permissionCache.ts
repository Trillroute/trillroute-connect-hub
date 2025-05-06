
import { AdminLevel, PermissionsCache, RolesCache } from "./types";

/**
 * In-memory cache for roles
 */
let rolesCache: RolesCache = {};

/**
 * In-memory cache for permission results
 */
let permissionsCache: PermissionsCache = {};

/**
 * In-memory cache for user-specific data
 */
const userPermissionsCache: { [userId: string]: PermissionsCache } = {};

/**
 * Set a role in the cache
 */
export const setCachedRole = (role: AdminLevel): void => {
  rolesCache[role.name] = role;
};

/**
 * Get a role from the cache
 */
export const getCachedRole = (roleName: string): AdminLevel | undefined => {
  return rolesCache[roleName];
};

/**
 * Check if a permission is cached
 */
export const hasCachedPermission = (key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(permissionsCache, key);
};

/**
 * Get a cached permission value
 */
export const getCachedPermission = (key: string): boolean | undefined => {
  return permissionsCache[key];
};

/**
 * Set a permission value in the cache
 */
export const setCachedPermission = (key: string, value: boolean): void => {
  permissionsCache[key] = value;
};

/**
 * Clear the permissions cache for a specific user
 * This should be called when a user's permissions might have changed
 */
export const clearPermissionsCache = (userId: string | undefined): void => {
  if (!userId) return;
  
  // Clear user-specific entries from the general cache
  const userPrefix = `${userId}:`;
  for (const key of Object.keys(permissionsCache)) {
    if (key.startsWith(userPrefix)) {
      delete permissionsCache[key];
    }
  }
  
  // Clear user-specific cache if it exists
  if (userPermissionsCache[userId]) {
    delete userPermissionsCache[userId];
  }
  
  console.log('[adminPermissions] Cleared permissions cache for user:', userId);
};

/**
 * Update the cached admin roles from the server
 */
export const updateCachedAdminRoles = (roles: AdminLevel[]): void => {
  // First clear the existing cache
  rolesCache = {};
  
  // Then add each role to the cache
  for (const role of roles) {
    setCachedRole(role);
  }
  
  console.log('[adminPermissions] Updated admin roles cache with', roles.length, 'roles');
};

/**
 * Clear all caches (should be called on logout)
 */
export const clearAllCaches = (): void => {
  rolesCache = {};
  permissionsCache = {};
  Object.keys(userPermissionsCache).forEach(key => {
    delete userPermissionsCache[key];
  });
};
