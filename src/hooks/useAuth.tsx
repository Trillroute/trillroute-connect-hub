
import { useAuthContext } from '@/contexts/AuthContext';
import { useRoleManagement } from './useRoleManagement';
import { useProvideAuth } from './useProvideAuth';

export const useAuth = () => {
  const { user, loading, login, logout, isAuthenticated, refreshSession } = useAuthContext();
  const { isAdmin, isSuperAdmin, role } = useRoleManagement();
  
  // Combine all auth-related properties and methods into a single object
  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isSuperAdmin,
    role,
    isAuthenticated,
    refreshSession,
    // Additional methods from useProvideAuth
    ...useProvideAuth()
  };
};
