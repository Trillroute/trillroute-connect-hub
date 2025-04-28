import React, { ReactNode } from 'react';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRegistration } from './useRegistration';
import { useRoleManagement } from './useRoleManagement';
import type { UserRole, StudentProfileData, AuthContextType } from '@/types/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
  );
};

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

export type { UserRole };
