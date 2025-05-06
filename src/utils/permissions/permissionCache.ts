
import { AdminLevel } from './types';

// In-memory cache for admin roles and permissions
let adminRolesCache: AdminLevel[] = [];
let permissionCache: Record<string, Record<string, boolean>> = {};

// Update the admin roles cache
export const updateCachedAdminRoles = (roles: AdminLevel[]) => {
  adminRolesCache = [...roles];
  console.log('[PermissionCache] Updated admin roles cache with', roles.length, 'roles');
};

// Get admin role by name
export const getAdminRoleByName = (roleName?: string): AdminLevel | null => {
  if (!roleName) return null;
  
  const role = adminRolesCache.find(r => r.name === roleName);
  return role || null;
};

// Clear the permission cache
export const clearPermissionCache = () => {
  permissionCache = {};
  console.log('[PermissionCache] Permission cache cleared');
};

// Cache a permission check result
export const cachePermission = (userId: string, permission: string, isAllowed: boolean) => {
  if (!permissionCache[userId]) {
    permissionCache[userId] = {};
  }
  permissionCache[userId][permission] = isAllowed;
};

// Get a cached permission check result (or null if not cached)
export const getCachedPermission = (userId: string, permission: string): boolean | null => {
  return permissionCache[userId]?.[permission] ?? null;
};
