
import React, { createContext, useContext } from 'react';
import type { UserData } from '@/types/auth';

interface AuthenticationContextType {
  loading: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<boolean>;
}

export const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthenticationProvider');
  }
  return context;
};
