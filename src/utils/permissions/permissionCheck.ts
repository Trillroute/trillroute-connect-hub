
import { AdminPermission, PermissionUser } from './types';
import { getAdminRoleByName, getCachedPermission, cachePermission } from './permissionCache';

// Check if a user has a specific permission
export const hasPermission = (user: PermissionUser | null, permission: AdminPermission): boolean => {
  if (!user) return false;
  
  // Superadmin has all permissions
  if (user.role === 'superadmin') return true;
  
  // Only admins have administrative permissions
  if (user.role !== 'admin') return false;
  
  // Check cached permission
  const cachedResult = getCachedPermission(user.id, permission);
  if (cachedResult !== null) return cachedResult;
  
  // Get admin role by name
  const adminRole = getAdminRoleByName(user.adminRoleName);
  if (!adminRole) return false;
  
  // Calculate permissions based on admin role
  let isAllowed = false;
  
  switch(permission) {
    // Student permissions
    case AdminPermission.VIEW_STUDENTS:
      isAllowed = adminRole.studentPermissions.includes('view');
      break;
    case AdminPermission.ADD_STUDENTS:
      isAllowed = adminRole.studentPermissions.includes('add');
      break;
    case AdminPermission.EDIT_STUDENTS:
      isAllowed = adminRole.studentPermissions.includes('edit');
      break;
    case AdminPermission.DELETE_STUDENTS:
      isAllowed = adminRole.studentPermissions.includes('delete');
      break;
      
    // Teacher permissions
    case AdminPermission.VIEW_TEACHERS:
      isAllowed = adminRole.teacherPermissions.includes('view');
      break;
    case AdminPermission.ADD_TEACHERS:
      isAllowed = adminRole.teacherPermissions.includes('add');
      break;
    case AdminPermission.EDIT_TEACHERS:
      isAllowed = adminRole.teacherPermissions.includes('edit');
      break;
    case AdminPermission.DELETE_TEACHERS:
      isAllowed = adminRole.teacherPermissions.includes('delete');
      break;
      
    // Admin permissions
    case AdminPermission.VIEW_ADMINS:
      isAllowed = adminRole.adminPermissions.includes('view');
      break;
    case AdminPermission.ADD_ADMINS:
      isAllowed = adminRole.adminPermissions.includes('add');
      break;
    case AdminPermission.EDIT_ADMINS:
      isAllowed = adminRole.adminPermissions.includes('edit');
      break;
    case AdminPermission.DELETE_ADMINS:
      isAllowed = adminRole.adminPermissions.includes('delete');
      break;
      
    // Lead permissions
    case AdminPermission.VIEW_LEADS:
      isAllowed = adminRole.leadPermissions.includes('view');
      break;
    case AdminPermission.ADD_LEADS:
      isAllowed = adminRole.leadPermissions.includes('add');
      break;
    case AdminPermission.EDIT_LEADS:
      isAllowed = adminRole.leadPermissions.includes('edit');
      break;
    case AdminPermission.DELETE_LEADS:
      isAllowed = adminRole.leadPermissions.includes('delete');
      break;
      
    // Course permissions
    case AdminPermission.VIEW_COURSES:
      isAllowed = adminRole.coursePermissions.includes('view');
      break;
    case AdminPermission.ADD_COURSES:
      isAllowed = adminRole.coursePermissions.includes('add');
      break;
    case AdminPermission.EDIT_COURSES:
      isAllowed = adminRole.coursePermissions.includes('edit');
      break;
    case AdminPermission.DELETE_COURSES:
      isAllowed = adminRole.coursePermissions.includes('delete');
      break;
      
    // Level permissions
    case AdminPermission.VIEW_LEVELS:
      isAllowed = adminRole.levelPermissions?.includes('view') || false;
      break;
    case AdminPermission.ADD_LEVELS:
      isAllowed = adminRole.levelPermissions?.includes('add') || false;
      break;
    case AdminPermission.EDIT_LEVELS:
      isAllowed = adminRole.levelPermissions?.includes('edit') || false;
      break;
    case AdminPermission.DELETE_LEVELS:
      isAllowed = adminRole.levelPermissions?.includes('delete') || false;
      break;
  }
  
  // Cache the permission check result
  cachePermission(user.id, permission, isAllowed);
  
  return isAllowed;
};
