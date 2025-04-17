
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { hasPermission, AdminPermission } from '@/utils/adminPermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requiredPermissions?: AdminPermission[];
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAdmin = false,
  requireSuperAdmin = false,
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const { user, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Superadmin can access any route - explicit check before any other checks
  if (user.role === 'superadmin' || isSuperAdmin()) {
    console.log('[ProtectedRoute] User is superadmin or has SuperAdmin level, granting access');
    return <>{children}</>;
  }

  // First check for superadmin requirement - this is a critical check
  if (requireSuperAdmin) {
    console.log('[ProtectedRoute] Route requires superadmin, current role:', user.role);
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for admin requirement
  if (requireAdmin && user.role !== 'admin') {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for specific role requirement
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for specific permissions if user is an admin
  if (requiredPermissions.length > 0 && user.role === 'admin') {
    // Use adminRoleName for permission checks
    const userForPermissionCheck = {
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt || new Date().toISOString(),
      adminRoleName: user.adminRoleName || "Limited View" // Use adminRoleName for permissions
    };

    const hasAllRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(userForPermissionCheck, permission)
    );

    if (!hasAllRequiredPermissions) {
      // If admin doesn't have required permissions, redirect to admin dashboard
      return <Navigate to="/dashboard/admin" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
