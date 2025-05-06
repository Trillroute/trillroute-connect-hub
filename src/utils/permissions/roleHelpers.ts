
import { AdminLevel } from './types';

/**
 * Check if the admin level name indicates a superadmin role
 * Case insensitive and ignores spaces
 */
export const isSuperAdminLevel = (name?: string): boolean => {
  if (!name) return false;
  const normalized = name.toLowerCase().replace(/\s+/g, '');
  return normalized === 'superadmin';
};

/**
 * Check if a role has a specific permission for a module
 */
export const checkModulePermission = (
  role: AdminLevel, 
  module: string, 
  operation: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!role) return false;
  
  // Map the module name to the corresponding permission set
  const permissionKey = `${module}Permissions` as keyof AdminLevel;
  
  // Get permission array, ensuring we handle unexpected data formats
  const permissions = role[permissionKey];
  
  if (!Array.isArray(permissions)) {
    console.error(`[roleHelpers] Invalid permissions format for ${module} in role ${role.name}`);
    return false;
  }
  
  // Check if the operation is included in the permissions
  return permissions.includes(operation);
};
