
import { useAuth } from '@/hooks/useAuth';
import { canManageCourses } from '@/utils/permissions';

export const useCoursePermissions = (
  canAddCourse = true,
  canDeleteCourse = true,
  canEditCourse = true
) => {
  const { user, isSuperAdmin } = useAuth();
  
  // Force superadmin to always have permissions
  const userCanEdit = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'edit'));
  const userCanDelete = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'delete'));
  const userCanAdd = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'add'));
  
  // Combine props permissions with user permissions
  const effectiveCanEditCourse = canEditCourse && userCanEdit;
  const effectiveCanDeleteCourse = canDeleteCourse && userCanDelete;
  const effectiveCanAddCourse = canAddCourse && userCanAdd;
  
  return {
    effectiveCanEditCourse,
    effectiveCanDeleteCourse,
    effectiveCanAddCourse,
    userCanEdit,
    userCanDelete,
    userCanAdd
  };
};
