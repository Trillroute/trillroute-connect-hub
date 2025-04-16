
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAdmin = false,
  requireSuperAdmin = false
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
