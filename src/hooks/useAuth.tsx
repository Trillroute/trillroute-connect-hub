
import { useAuthContext } from '@/contexts/AuthContext';
import { useRegistration } from './useRegistration';
import { useRoleManagement } from './useRoleManagement';
import type { AuthContextType } from '@/types/auth';

export const useAuth = () => {
  const { user, loading, login, logout, isAuthenticated, refreshSession } = useAuthContext();
  const { register } = useRegistration();
  const { isAdmin, isSuperAdmin, role } = useRoleManagement();

  // Log info to help debug
  console.log('useAuth hook - Current user:', user?.role, 'Admin role name:', user?.adminRoleName);
  
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

// Create a wrapper for exposing the auth context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};
