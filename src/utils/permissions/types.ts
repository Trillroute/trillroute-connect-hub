
import { UserManagementUser } from "@/types/student";

// Define a more generic user type that works with both UserData and UserManagementUser
export interface PermissionUser {
  id: string;
  role: string;
  adminRoleName?: string;
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
  DELETE_COURSES = 'delete_courses',
  
  VIEW_LEVELS = 'view_levels',
  ADD_LEVELS = 'add_levels',
  EDIT_LEVELS = 'edit_levels',
  DELETE_LEVELS = 'delete_levels'
}

// AdminLevel interface
export interface AdminLevel {
  name: string;
  description: string;
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
  levelPermissions?: string[];
}
