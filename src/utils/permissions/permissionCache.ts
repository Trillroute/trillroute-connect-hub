
import { AdminLevel } from "./types";

// Add a cached permissions map to avoid re-calculating permissions
let cachedPermissions = new Map<string, boolean>();
let cachedAdminRoles = new Map<string, AdminLevel>();

/**
 * Update cached admin roles from database
 */
export const updateCachedAdminRoles = (adminRoles: AdminLevel[]): void => {
  console.log('[adminPermissions] Updating cached admin roles:', adminRoles);
  cachedAdminRoles.clear();
  
  // Add all roles to the cache
  adminRoles.forEach(role => {
    if (role && role.name) {
      cachedAdminRoles.set(role.name, role);
    }
  });
  
  // Clear permissions cache when roles are updated
  cachedPermissions.clear();
  
  console.log('[adminPermissions] Updated admin roles cache. Current roles:', 
    Array.from(cachedAdminRoles.keys()));
};

/**
 * Get cached admin role by name
 */
export const getCachedRole = (roleName: string): AdminLevel | undefined => {
  return cachedAdminRoles.get(roleName);
};

/**
 * Set permission in cache
 */
export const setCachedPermission = (cacheKey: string, hasPermission: boolean): void => {
  cachedPermissions.set(cacheKey, hasPermission);
};

/**
 * Get permission from cache
 */
export const getCachedPermission = (cacheKey: string): boolean | undefined => {
  return cachedPermissions.get(cacheKey);
};

/**
 * Check if permission exists in cache
 */
export const hasCachedPermission = (cacheKey: string): boolean => {
  return cachedPermissions.has(cacheKey);
};

/**
 * Clear the permissions cache for a user
 */
export const clearPermissionsCache = (userId?: string): void => {
  console.log('Clearing permissions cache for user:', userId);
  if (userId) {
    // Clear only for specific user
    cachedPermissions.forEach((_, key) => {
      if (key.startsWith(`${userId}:`)) {
        cachedPermissions.delete(key);
      }
    });
  } else {
    // Clear all cache
    cachedPermissions.clear();
  }
};
