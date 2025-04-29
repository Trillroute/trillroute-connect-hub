
/**
 * Helper function to check if an admin level name is a SuperAdmin equivalent
 */
export function isSuperAdminLevel(levelName: string | undefined): boolean {
  if (!levelName) return false;
  // Normalize the level name for comparison
  const normalizedName = levelName.toLowerCase().replace(/\s+/g, '');
  return normalizedName === 'superadmin' || normalizedName === 'super admin';
}

/**
 * Helper function to map module and operation to permission key
 */
export function getPermissionKey(module: string, operation: string): string | null {
  const key = `${operation.toUpperCase()}_${module.toUpperCase()}S`;
  return key || null;
}

/**
 * Helper function to check if a specific module permission exists
 */
export function checkModulePermission(
  roleInfo: { [key: string]: any }, 
  module: string, 
  operation: string
): boolean {
  const permissionsKey = `${module}Permissions`;
  const permissions = roleInfo[permissionsKey] as string[];
  
  const result = Array.isArray(permissions) && permissions.includes(operation);
  console.log(`[adminPermissions] Checking ${module} ${operation} permission:`, result, 'Available permissions:', permissions);
  return result;
}
