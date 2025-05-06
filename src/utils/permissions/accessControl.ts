
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminPermission } from './types';
import { hasPermission } from './permissionCheck';

// Higher-order component to control access based on permissions
export const withPermission = (
  Component: React.ComponentType,
  requiredPermission: AdminPermission
) => {
  return function PermissionGatedComponent(props: any) {
    const { user } = useAuth();
    
    if (!hasPermission(user, requiredPermission)) {
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Component to conditionally render content based on permissions
interface PermissionGateProps {
  permission: AdminPermission;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGate = ({ permission, fallback = null, children }: PermissionGateProps) => {
  const { user } = useAuth();
  
  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
