
import { UserManagementUser } from "@/types/student";
import { AdminPermission, PermissionUser } from "./types";
import { isSuperAdminLevel, checkModulePermission } from "./roleHelpers";
import { getCachedRole, hasCachedPermission, getCachedPermission, setCachedPermission } from "./permissionCache";
import { FALLBACK_ADMIN_ROLES } from "./fallbackRoles";

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  user: UserManagementUser | PermissionUser | null, 
  permission: AdminPermission
): boolean => {
  if (!user) return false;
  
  // Always check for superadmin first - superadmins have all permissions
  if (user.role === 'superadmin') {
    console.log('[adminPermissions] Superadmin always has permission:', permission);
    return true;
  }
  
  // Only admins can have these permissions
  if (user.role !== 'admin') {
    console.log('[adminPermissions] User is not admin or superadmin, denying permission:', permission);
    return false;
  }
  
  // Use cache for better performance
  const cacheKey = `${user.id}:${permission}`;
  if (hasCachedPermission(cacheKey)) {
    const result = getCachedPermission(cacheKey) || false;
    console.log(`[adminPermissions] Using cached permission for ${cacheKey}:`, result);
    return result;
  }
  
  // Use adminRoleName to get the role info
  const adminRoleName = 'adminRoleName' in user ? user.adminRoleName : undefined;
  console.log('[adminPermissions] Checking permissions with adminRoleName:', adminRoleName);
  
  // If the adminRoleName is a SuperAdmin equivalent, grant all permissions
  if (isSuperAdminLevel(adminRoleName)) {
    console.log('[adminPermissions] User has SuperAdmin role name, granting permission');
    setCachedPermission(cacheKey, true);
    return true;
  }
  
  // Check if we have the role cached first
  const roleInfo = adminRoleName ? getCachedRole(adminRoleName) : undefined;
  
  // Fall back to default roles if no specific role found
  let effectiveRoleInfo;
  if (roleInfo) {
    console.log('[adminPermissions] Using cached role info:', roleInfo.name);
    effectiveRoleInfo = roleInfo;
  } else if (adminRoleName && FALLBACK_ADMIN_ROLES[adminRoleName]) {
    console.log('[adminPermissions] Using fallback role for:', adminRoleName);
    effectiveRoleInfo = FALLBACK_ADMIN_ROLES[adminRoleName];
  } else {
    console.log('[adminPermissions] Using default Limited View role');
    effectiveRoleInfo = FALLBACK_ADMIN_ROLES["Limited View"];
  }
  
  let hasPermission = false;
  
  // Map permission enum to module and operation
  if (permission.startsWith('VIEW_')) {
    const module = permission.substring(5).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(effectiveRoleInfo, module, 'view');
  } else if (permission.startsWith('ADD_')) {
    const module = permission.substring(4).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(effectiveRoleInfo, module, 'add');
  } else if (permission.startsWith('EDIT_')) {
    const module = permission.substring(5).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(effectiveRoleInfo, module, 'edit');
  } else if (permission.startsWith('DELETE_')) {
    const module = permission.substring(7).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(effectiveRoleInfo, module, 'delete');
  }
  
  console.log(`[adminPermissions] Permission check for ${permission}:`, hasPermission);
  
  // Cache the result
  setCachedPermission(cacheKey, hasPermission);
  
  return hasPermission;
};
