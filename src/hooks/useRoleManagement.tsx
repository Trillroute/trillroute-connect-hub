
import { useAuthContext } from '@/contexts/AuthContext';

export const useRoleManagement = () => {
  const { user } = useAuthContext();

  const isSuperAdminLevel = (name?: string): boolean => {
    if (!name) return false;
    const normalized = name.toLowerCase().replace(/\s+/g, '');
    return normalized === 'superadmin' || normalized === 'super admin';
  };

  const isAdmin = () => {
    console.log('[useAuth] isAdmin check, current role:', user?.role);
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    console.log('[useAuth] isSuperAdmin check, current role:', user?.role);
    
    if (user?.role === 'superadmin') {
      return true;
    }
    
    if (user?.role === 'admin' && user?.adminRoleName) {
      return isSuperAdminLevel(user.adminRoleName);
    }
    
    return false;
  };

  return {
    isAdmin,
    isSuperAdmin,
    role: user?.role || null
  };
};
