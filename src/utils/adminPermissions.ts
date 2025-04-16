
/**
 * Admin Permission Level Utility
 * 
 * Level 0: All permissions and functionality as super admins
 * Level 1: View, Add and Remove Students, Teachers, and Courses
 * Level 2: View and Add Students and Teachers, View, Add and Remove Courses
 * Level 3: View, Add and Remove Students and Teachers, View and Add Courses
 * Level 4: View and Add Students and Teachers, View and Add Courses
 * Level 5: View Students and Teachers, View and Add Courses
 * Level 6: View and Add Students and Teachers, View Courses
 * Level 8: View Students and Teachers, View Courses
 */

import { UserManagementUser } from "@/types/student";

export enum AdminPermission {
  VIEW_STUDENTS = 'view_students',
  ADD_STUDENTS = 'add_students',
  REMOVE_STUDENTS = 'remove_students',
  VIEW_TEACHERS = 'view_teachers',
  ADD_TEACHERS = 'add_teachers',
  REMOVE_TEACHERS = 'remove_teachers',
  VIEW_COURSES = 'view_courses',
  ADD_COURSES = 'add_courses',
  REMOVE_COURSES = 'remove_courses'
}

export interface AdminLevel {
  level: number;
  name: string;
  description: string;
  permissions: string[];
}

// Map of permission levels to their granted permissions
// This is used as a fallback in case the database query fails
const FALLBACK_PERMISSION_MAP: Record<number, AdminPermission[]> = {
  0: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.REMOVE_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.REMOVE_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES,
    AdminPermission.REMOVE_COURSES
  ],
  1: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.REMOVE_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.REMOVE_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES,
    AdminPermission.REMOVE_COURSES
  ],
  2: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES,
    AdminPermission.REMOVE_COURSES
  ],
  3: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.REMOVE_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.REMOVE_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES
  ],
  4: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES
  ],
  5: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.VIEW_COURSES,
    AdminPermission.ADD_COURSES
  ],
  6: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.ADD_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.ADD_TEACHERS,
    AdminPermission.VIEW_COURSES
  ],
  8: [
    AdminPermission.VIEW_STUDENTS,
    AdminPermission.VIEW_TEACHERS,
    AdminPermission.VIEW_COURSES
  ]
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: UserManagementUser | null, permission: AdminPermission): boolean => {
  if (!user) return false;
  
  // Superadmins have all permissions
  if (user.role === 'superadmin') return true;
  
  // Only admins can have these permissions
  if (user.role !== 'admin') return false;
  
  // Get the user's admin level, default to level 8 (most restrictive)
  const adminLevel = user.adminLevel ?? 8;
  
  // Check if the user's level grants this permission
  const permissions = FALLBACK_PERMISSION_MAP[adminLevel] || [];
  return permissions.includes(permission);
};

/**
 * Get all permissions for a specific admin level
 */
export const getPermissionsForLevel = (level: number): AdminPermission[] => {
  return FALLBACK_PERMISSION_MAP[level] || [];
};

/**
 * Helper function to determine if a specific user can perform actions on students
 */
export const canManageStudents = (user: UserManagementUser | null, action: 'view' | 'add' | 'remove'): boolean => {
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_STUDENTS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_STUDENTS);
  } else {
    return hasPermission(user, AdminPermission.REMOVE_STUDENTS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on teachers
 */
export const canManageTeachers = (user: UserManagementUser | null, action: 'view' | 'add' | 'remove'): boolean => {
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_TEACHERS);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_TEACHERS);
  } else {
    return hasPermission(user, AdminPermission.REMOVE_TEACHERS);
  }
};

/**
 * Helper function to determine if a specific user can perform actions on courses
 */
export const canManageCourses = (user: UserManagementUser | null, action: 'view' | 'add' | 'remove'): boolean => {
  if (action === 'view') {
    return hasPermission(user, AdminPermission.VIEW_COURSES);
  } else if (action === 'add') {
    return hasPermission(user, AdminPermission.ADD_COURSES);
  } else {
    return hasPermission(user, AdminPermission.REMOVE_COURSES);
  }
};
