
import { UserManagementUser } from "@/types/student";

/**
 * User type for permission checks (simplified version of UserManagementUser)
 */
export interface PermissionUser {
  id: string;
  role?: string;
  adminLevel?: number;
  adminRoleName?: string;
}

/**
 * Enumeration of admin permissions
 */
export enum AdminPermission {
  // Students
  VIEW_STUDENTS = "VIEW_STUDENTS",
  ADD_STUDENTS = "ADD_STUDENTS",
  EDIT_STUDENTS = "EDIT_STUDENTS",
  DELETE_STUDENTS = "DELETE_STUDENTS",

  // Teachers
  VIEW_TEACHERS = "VIEW_TEACHERS",
  ADD_TEACHERS = "ADD_TEACHERS",
  EDIT_TEACHERS = "EDIT_TEACHERS",
  DELETE_TEACHERS = "DELETE_TEACHERS",

  // Admins
  VIEW_ADMINS = "VIEW_ADMINS",
  ADD_ADMINS = "ADD_ADMINS",
  EDIT_ADMINS = "EDIT_ADMINS",
  DELETE_ADMINS = "DELETE_ADMINS",

  // Leads
  VIEW_LEADS = "VIEW_LEADS",
  ADD_LEADS = "ADD_LEADS",
  EDIT_LEADS = "EDIT_LEADS",
  DELETE_LEADS = "DELETE_LEADS",

  // Courses
  VIEW_COURSES = "VIEW_COURSES",
  ADD_COURSES = "ADD_COURSES",
  EDIT_COURSES = "EDIT_COURSES",
  DELETE_COURSES = "DELETE_COURSES",

  // Levels
  VIEW_LEVELS = "VIEW_LEVELS",
  ADD_LEVELS = "ADD_LEVELS",
  EDIT_LEVELS = "EDIT_LEVELS",
  DELETE_LEVELS = "DELETE_LEVELS",
  
  // Events
  VIEW_EVENTS = "VIEW_EVENTS",
  ADD_EVENTS = "ADD_EVENTS",
  EDIT_EVENTS = "EDIT_EVENTS",
  DELETE_EVENTS = "DELETE_EVENTS",
}

/**
 * Admin role level definition - used for both API and UI
 */
export interface AdminLevel {
  id?: string;
  name: string;
  level: number;
  description: string;
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
  levelPermissions?: string[];
  eventsPermissions?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Roles cache object type
 */
export type RolesCache = {
  [roleName: string]: AdminLevel;
};

/**
 * Permissions cache object type
 */
export type PermissionsCache = {
  [key: string]: boolean;
};

/**
 * Import/export format for roles
 */
export interface AdminRoleExport {
  roleName: string;
  permissions: {
    students: string[];
    teachers: string[];
    admins: string[];
    leads: string[];
    courses: string[];
    levels?: string[];
  };
}
