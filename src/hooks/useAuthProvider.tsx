
import React, { ReactNode } from 'react';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
  );
};
