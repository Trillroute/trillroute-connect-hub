
/**
 * Admin Permission Level Utility
 * 
 * Module-based permission system for:
 * - Student management
 * - Teacher management
 * - Admin management
 * - Lead management
 * - Course management
 * 
 * Each module can have these permissions: view, add, edit, delete
 */

import { UserManagementUser } from "@/types/student";
import { supabase } from '@/integrations/supabase/client';

// Define a more generic user type that works with both UserData and UserManagementUser
export interface PermissionUser {
  id: string;
  role: string;
}

export enum AdminPermission {
  VIEW_STUDENTS = 'view_students',
  ADD_STUDENTS = 'add_students',
  EDIT_STUDENTS = 'edit_students',
  DELETE_STUDENTS = 'delete_students',
  
  VIEW_TEACHERS = 'view_teachers',
  ADD_TEACHERS = 'add_teachers',
  EDIT_TEACHERS = 'edit_teachers',
  DELETE_TEACHERS = 'delete_teachers',
  
  VIEW_ADMINS = 'view_admins',
  ADD_ADMINS = 'add_admins',
  EDIT_ADMINS = 'edit_admins',
  DELETE_ADMINS = 'delete_admins',
  
  VIEW_LEADS = 'view_leads',
  ADD_LEADS = 'add_leads',
  EDIT_LEADS = 'edit_leads',
  DELETE_LEADS = 'delete_leads',
  
  VIEW_COURSES = 'view_courses',
  ADD_COURSES = 'add_courses',
  EDIT_COURSES = 'edit_courses',
  DELETE_COURSES = 'delete_courses'
}

export interface AdminLevel {
  name: string;
  description: string;
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
}

// Fallback permissions mapping in case we can't fetch from database
const FALLBACK_ADMIN_ROLES: Record<string, AdminLevel> = {
  "superadmin": {
    name: "Super Admin",
    description: "All permissions and functionality",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  "admin": {
    name: "Admin",
    description: "High-level administrator",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  "manager": {
    name: "Manager",
    description: "Mid-level administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  "assistant": {
    name: "Assistant",
    description: "Limited administrator",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: ["view"],
    coursePermissions: ["view"]
  },
  "Limited View": {
    name: "Limited View",
    description: "Limited view-only access",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"]
  }
};

// Helper function to map module and operation to AdminPermission enum
function getPermissionKey(module: string, operation: string): AdminPermission | null {
  const key = `${operation.toUpperCase()}_${module.toUpperCase()}S` as keyof typeof AdminPermission;
  return AdminPermission[key] || null;
}

// Add a cached permissions map to avoid re-calculating permissions
let cachedPermissions = new Map<string, boolean>();
let cachedAdminRoles = new Map<string, AdminLevel>();

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: UserManagementUser | PermissionUser | null, permission: AdminPermission): boolean => {
  if (!user) return false;
  
  // Superadmins have all permissions
  if (user.role === 'superadmin') {
    console.log('Superadmin always has permission:', permission);
    return true;
  }
  
  // Only admins can have these permissions
  if (user.role !== 'admin') {
    console.log('User is not admin or superadmin, denying permission:', permission);
    return false;
  }
  
  // Use cache for better performance
  const cacheKey = `${user.id}:${permission}`;
  if (cachedPermissions.has(cacheKey)) {
    const result = cachedPermissions.get(cacheKey) || false;
    console.log(`Using cached permission for ${cacheKey}:`, result);
    return result;
  }
  
  // Use adminRoleName to get the role info
  const adminRoleName = 'adminRoleName' in user ? user.adminRoleName : undefined;
  console.log('Checking permissions with adminRoleName:', adminRoleName);
  
  const roleInfo = adminRoleName ? cachedAdminRoles.get(adminRoleName) : undefined;
  
  // Fall back to default roles if no specific role found
  let effectiveRoleInfo;
  if (roleInfo) {
    console.log('Using cached role info:', roleInfo.name);
    effectiveRoleInfo = roleInfo;
  } else if (adminRoleName && FALLBACK_ADMIN_ROLES[adminRoleName]) {
    console.log('Using fallback role for:', adminRoleName);
    effectiveRoleInfo = FALLBACK_ADMIN_ROLES[adminRoleName];
  } else {
    console.log('Using default assistant role');
    effectiveRoleInfo = FALLBACK_ADMIN_ROLES["assistant"];
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
  
  console.log(`Permission check for ${permission}:`, hasPermission);
  
  // Cache the result
  cachedPermissions.set(cacheKey, hasPermission);
  
  return hasPermission;
};

// Helper function to check if a specific module permission exists
function checkModulePermission(roleInfo: AdminLevel, module: string, operation: string): boolean {
  const permissionsKey = `${module}Permissions` as keyof AdminLevel;
  const permissions = roleInfo[permissionsKey] as string[];
  
  const result = Array.isArray(permissions) && permissions.includes(operation);
  console.log(`Checking ${module} ${operation} permission:`, result, 'Available permissions:', permissions);
  return result;
}

// Function to update cached admin roles from database
export const updateCachedAdminRoles = (adminRoles: AdminLevel[]): void => {
  console.log('Updating cached admin roles:', adminRoles);
  cachedAdminRoles.clear();
  
  adminRoles.forEach(role => {
    cachedAdminRoles.set(role.name, role);
  });
};

/**
 * Clear the permissions cache for a user
 */
export const clearPermissionsCache = (userId?: string) => {
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

/**
 * Helper function to determine if a specific user can perform actions on students
 */
export const canManageStudents = (user: UserManagementUser | PermissionUser | null, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
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
export const canManageTeachers = (user: UserManagementUser | PermissionUser | null, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
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
export const canManageAdmins = (user: UserManagementUser | PermissionUser | null, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
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
export const canManageLeads = (user: UserManagementUser | PermissionUser | null, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
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
export const canManageCourses = (user: UserManagementUser | PermissionUser | null, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
  if (user?.role === 'superadmin') {
    return true;
  }
  
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
