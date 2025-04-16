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
  adminLevel?: number;
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
  level: number;
  name: string;
  description: string;
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
}

// Fallback permissions mapping in case we can't fetch from database
const FALLBACK_ADMIN_LEVELS: Record<number, AdminLevel> = {
  0: {
    level: 0,
    name: "Super Admin Equivalent",
    description: "All permissions and functionality as the super admins",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  1: {
    level: 1,
    name: "Level 1",
    description: "High-level administrator",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  2: {
    level: 2,
    name: "Level 2",
    description: "Mid-level administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  3: {
    level: 3,
    name: "Level 3",
    description: "Mid-level administrator",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  4: {
    level: 4,
    name: "Level 4",
    description: "Limited administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  5: {
    level: 5,
    name: "Level 5",
    description: "View-only administrator with limited add capabilities",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  6: {
    level: 6,
    name: "Level 6",
    description: "Limited administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"]
  },
  8: {
    level: 8,
    name: "Level 8",
    description: "View-only administrator",
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
let cachedAdminLevels = new Map<number, AdminLevel>();

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: UserManagementUser | PermissionUser | null, permission: AdminPermission): boolean => {
  if (!user) return false;
  
  // Superadmins have all permissions
  if (user.role === 'superadmin') return true;
  
  // Only admins can have these permissions
  if (user.role !== 'admin') return false;
  
  // Get the user's admin level, default to level 8 (most restrictive)
  const adminLevel = user.adminLevel ?? 8;
  
  // Use cache for better performance
  const cacheKey = `${user.id}:${permission}`;
  if (cachedPermissions.has(cacheKey)) {
    return cachedPermissions.get(cacheKey) || false;
  }
  
  // Get the user's permission level
  const levelInfo = cachedAdminLevels.get(adminLevel) || FALLBACK_ADMIN_LEVELS[adminLevel] || FALLBACK_ADMIN_LEVELS[8];
  
  let hasPermission = false;
  
  // Map permission enum to module and operation
  if (permission.startsWith('VIEW_')) {
    const module = permission.substring(5).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(levelInfo, module, 'view');
  } else if (permission.startsWith('ADD_')) {
    const module = permission.substring(4).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(levelInfo, module, 'add');
  } else if (permission.startsWith('EDIT_')) {
    const module = permission.substring(5).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(levelInfo, module, 'edit');
  } else if (permission.startsWith('DELETE_')) {
    const module = permission.substring(7).toLowerCase().replace('s', '');
    hasPermission = checkModulePermission(levelInfo, module, 'delete');
  }
  
  // Cache the result
  cachedPermissions.set(cacheKey, hasPermission);
  
  return hasPermission;
};

// Helper function to check if a specific module permission exists
function checkModulePermission(levelInfo: AdminLevel, module: string, operation: string): boolean {
  const permissionsKey = `${module}Permissions` as keyof AdminLevel;
  const permissions = levelInfo[permissionsKey] as string[];
  
  return Array.isArray(permissions) && permissions.includes(operation);
}

// Function to update cached admin levels from database
export const updateCachedAdminLevels = (adminLevels: AdminLevel[]): void => {
  cachedAdminLevels.clear();
  
  adminLevels.forEach(level => {
    cachedAdminLevels.set(level.level, level);
  });
};

/**
 * Clear the permissions cache for a user
 */
export const clearPermissionsCache = (userId?: string) => {
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
  return canManageStudents(user, 'view') || 
         canManageTeachers(user, 'view') ||
         canManageStudents(user, 'add') ||
         canManageTeachers(user, 'add');
};

/**
 * Helper to check if user has access to any course management features
 */
export const hasCourseManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  return canManageCourses(user, 'view') ||
         canManageCourses(user, 'add');
};

/**
 * Helper to check if user has access to any lead management features
 */
export const hasLeadManagementAccess = (user: UserManagementUser | PermissionUser | null): boolean => {
  return canManageLeads(user, 'view') ||
         canManageLeads(user, 'add');
};
