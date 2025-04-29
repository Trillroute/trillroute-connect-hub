
import { UserManagementUser } from "@/types/student";
import { PermissionUser } from "./types";
import { canManageStudents, canManageTeachers, canManageCourses, canManageLeads, canManageLevels } from "./modulePermissions";

/**
 * Helper to check if user has access to any user management features
 */
export const hasUserManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  if (user?.role === 'superadmin') {
    return true;
  }
  
  return canManageStudents(user, 'view') || 
         canManageTeachers(user, 'view') ||
         canManageStudents(user, 'add') ||
         canManageTeachers(user, 'add');
};

/**
 * Helper to check if user has access to any course management features
 */
export const hasCourseManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  if (user?.role === 'superadmin') {
    return true;
  }
  
  return canManageCourses(user, 'view') ||
         canManageCourses(user, 'add');
};

/**
 * Helper to check if user has access to any lead management features
 */
export const hasLeadManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  if (user?.role === 'superadmin') {
    return true;
  }
  
  return canManageLeads(user, 'view') ||
         canManageLeads(user, 'add');
};

/**
 * Helper to check if user has access to any level management features
 */
export const hasLevelManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  if (user?.role === 'superadmin') {
    return true;
  }
  
  return canManageLevels(user, 'view') ||
         canManageLevels(user, 'add');
};
