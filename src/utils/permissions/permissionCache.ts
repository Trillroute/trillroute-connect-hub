
import { AdminLevel } from './types';

// In-memory cache for permission checks
const permissionCache: Record<string, boolean> = {};

// In-memory cache for admin roles
const adminRoleCache: Record<string, AdminLevel> = {};

/**
 * Check if a permission result is cached
 */
export const hasCachedPermission = (key: string): boolean => {
  return permissionCache.hasOwnProperty(key);
};

/**
 * Get a cached permission result
 */
export const getCachedPermission = (key: string): boolean | undefined => {
  return permissionCache[key];
};

/**
 * Set a permission result in the cache
 */
export const setCachedPermission = (key: string, value: boolean): void => {
  permissionCache[key] = value;
};

/**
 * Clear the permission cache
 */
export const clearPermissionCache = (): void => {
  Object.keys(permissionCache).forEach(key => {
    delete permissionCache[key];
  });
};

/**
 * Check if a role is cached
 */
export const hasCachedRole = (roleName: string): boolean => {
  return adminRoleCache.hasOwnProperty(roleName);
};

/**
 * Get a cached role
 */
export const getCachedRole = (roleName: string): AdminLevel | undefined => {
  return adminRoleCache[roleName];
};

/**
 * Set a role in the cache
 */
export const setCachedRole = (roleName: string, roleInfo: AdminLevel): void => {
  adminRoleCache[roleName] = roleInfo;
};

/**
 * Update all cached admin roles
 */
export const updateCachedAdminRoles = (roles: AdminLevel[]): void => {
  // Clear existing roles
  Object.keys(adminRoleCache).forEach(key => {
    delete adminRoleCache[key];
  });
  
  // Add new roles to cache
  roles.forEach(role => {
    setCachedRole(role.name, role);
  });
  
  // Clear permission cache since roles changed
  clearPermissionCache();
};

/**
 * Clear the role cache
 */
export const clearRoleCache = (): void => {
  Object.keys(adminRoleCache).forEach(key => {
    delete adminRoleCache[key];
  });
  // Also clear permission cache since roles are gone
  clearPermissionCache();
};
