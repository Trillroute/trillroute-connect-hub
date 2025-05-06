
import { AdminPermission } from './types';
import { hasPermission } from './permissionCheck';
import { useAuth } from '@/hooks/useAuth';

// These functions can be used in components to check permissions

// Student permissions
export function canViewStudents() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_STUDENTS);
}

export function canAddStudents() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_STUDENTS);
}

export function canEditStudents() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_STUDENTS);
}

export function canDeleteStudents() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_STUDENTS);
}

export function canManageStudents() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_STUDENTS);
}

// Teacher permissions
export function canViewTeachers() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_TEACHERS);
}

export function canAddTeachers() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_TEACHERS);
}

export function canEditTeachers() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_TEACHERS);
}

export function canDeleteTeachers() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_TEACHERS);
}

export function canManageTeachers() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_TEACHERS);
}

// Admin permissions
export function canViewAdmins() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_ADMINS);
}

export function canAddAdmins() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_ADMINS);
}

export function canEditAdmins() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_ADMINS);
}

export function canDeleteAdmins() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_ADMINS);
}

export function canManageAdmins() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_ADMINS);
}

// Lead permissions
export function canViewLeads() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_LEADS);
}

export function canAddLeads() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_LEADS);
}

export function canEditLeads() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_LEADS);
}

export function canDeleteLeads() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_LEADS);
}

export function canManageLeads() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_LEADS);
}

// Course permissions
export function canViewCourses() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_COURSES);
}

export function canAddCourses() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_COURSES);
}

export function canEditCourses() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_COURSES);
}

export function canDeleteCourses() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_COURSES);
}

export function canManageCourses() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_COURSES);
}

// Level permissions
export function canViewLevels() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_LEVELS);
}

export function canAddLevels() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.ADD_LEVELS);
}

export function canEditLevels() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.EDIT_LEVELS);
}

export function canDeleteLevels() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.DELETE_LEVELS);
}

export function canManageLevels() {
  const { user } = useAuth();
  return hasPermission(user, AdminPermission.VIEW_LEVELS);
}
