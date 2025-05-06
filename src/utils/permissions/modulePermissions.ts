
import { UserManagementUser } from "@/types/student";
import { PermissionUser } from "./types";
import { AdminPermission } from "./types";
import { hasPermission } from "./permissionCheck";
import { isSuperAdminLevel } from "./roleHelpers";

/**
 * Helper function to determine if a specific user can perform actions on students
 */
export const canManageStudents = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    return true;
  }
  
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_STUDENTS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_STUDENTS);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_STUDENTS);
  } else {
    return hasPermission(user, AdminPermission.DELETE_STUDENTS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on teachers
 */
export const canManageTeachers = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    return true;
  }
  
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_TEACHERS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_TEACHERS);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_TEACHERS);
  } else {
    return hasPermission(user, AdminPermission.DELETE_TEACHERS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on admins
 */
export const canManageAdmins = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    return true;
  }
  
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_ADMINS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_ADMINS);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_ADMINS);
  } else {
    return hasPermission(user, AdminPermission.DELETE_ADMINS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on leads
 */
export const canManageLeads = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    return true;
  }
  
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_LEADS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_LEADS);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_LEADS);
  } else {
    return hasPermission(user, AdminPermission.DELETE_LEADS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on courses
 */
export const canManageCourses = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  // Always grant permission to superadmin first
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    console.log('[adminPermissions] Superadmin can manage courses:', action);
    return true;
  }
  
  // Special check for SuperAdmin level admin role (both "SuperAdmin" and "Super Admin" formats)
  if (user?.role === 'admin' && user?.adminRoleName) {
    // Check if user has SuperAdmin role name (case and space insensitive)
    if (isSuperAdminLevel(user.adminRoleName)) {
      console.log('[adminPermissions] Admin with SuperAdmin role can manage courses:', action);
      return true;
    }
  }
  
  // Use the standard permission check as fallback
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_COURSES);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_COURSES);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_COURSES);
  } else {
    return hasPermission(user, AdminPermission.DELETE_COURSES);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on levels
 */
export const canManageLevels = (
  user: UserManagementUser | PermissionUser | null, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  if (user?.role === 'superadmin') {
    return true;
  }
  
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_LEVELS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_LEVELS);
  } else if (action === 'edit') {
    return hasPermission(user, AdminPermission.EDIT_LEVELS);
  } else {
    return hasPermission(user, AdminPermission.DELETE_LEVELS);
  }
};
