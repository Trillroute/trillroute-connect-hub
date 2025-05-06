
import { AdminLevel } from './types';

// Helper functions for working with admin roles

// Check if a role has a specific permission for a specific module
export const roleHasPermission = (
  role: AdminLevel | null,
  module: 'student' | 'teacher' | 'admin' | 'lead' | 'course' | 'level',
  permission: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!role) return false;
  
  const permissionKey = `${module}Permissions` as keyof AdminLevel;
  const permissions = role[permissionKey];
  
  if (!permissions) return false;
  
  return (permissions as string[]).includes(permission);
};

// Get all permissions for a role and module
export const getRoleModulePermissions = (
  role: AdminLevel | null,
  module: 'student' | 'teacher' | 'admin' | 'lead' | 'course' | 'level'
): string[] => {
  if (!role) return [];
  
  const permissionKey = `${module}Permissions` as keyof AdminLevel;
  const permissions = role[permissionKey];
  
  if (!permissions) return [];
  
  return permissions as string[];
};

// Get a display name for a role level
export const getRoleLevelDisplay = (roleName?: string): string => {
  if (!roleName) return 'Limited Access';
  return roleName;
};
