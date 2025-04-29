
import { useAuthContext } from '@/contexts/AuthContext';
import { useRegistration } from './useRegistration';
import { useRoleManagement } from './useRoleManagement';
import type { AuthContextType } from '@/types/auth';

// This is a duplicate of useAuth.tsx but kept for backward compatibility
export const useProvideAuth = (): AuthContextType => {
  const { user, loading, login, logout, isAuthenticated, refreshSession } = useAuthContext();
  const { register } = useRegistration();
  const { isAdmin, isSuperAdmin, role } = useRoleManagement();

  return {
    user,
    loading,
    role,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    refreshSession,
  };
};
