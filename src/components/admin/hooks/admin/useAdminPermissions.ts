
import { UserManagementUser } from '@/types/student';
import { useAuth } from '@/hooks/useAuth';

export const useAdminPermissions = (canEditAdmin: boolean, canDeleteAdmin: boolean, canEditAdminLevel: boolean) => {
  const { isSuperAdmin } = useAuth();
  
  // Override permissions for superadmin
  const effectiveCanEditAdminLevel = isSuperAdmin() ? true : canEditAdminLevel;

  const isAdminEditable = (admin: UserManagementUser) => {
    return isSuperAdmin() || canEditAdmin;
  };

  const canAdminBeDeleted = (admin: UserManagementUser) => {
    return isSuperAdmin() || canDeleteAdmin;
  };

  return {
    effectiveCanEditAdminLevel,
    isAdminEditable,
    canAdminBeDeleted
  };
};
