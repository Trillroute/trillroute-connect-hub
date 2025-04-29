
import { useAuthContext } from '@/contexts/AuthContext';
import { useRegistration } from './useRegistration';
import { useRoleManagement } from './useRoleManagement';
import type { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
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

// We no longer need this wrapper as we're using AuthenticationProvider from providers/AuthenticationProvider.tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return children; // This is just a pass-through now
};
