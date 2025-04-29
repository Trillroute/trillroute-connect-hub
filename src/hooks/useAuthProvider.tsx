
import React, { ReactNode } from 'react';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';

interface AuthProviderProps {
  children: ReactNode;
}

// This is just a wrapper around AuthenticationProvider for backward compatibility
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
  );
};
