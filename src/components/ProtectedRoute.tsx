
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { hasPermission, AdminPermission } from '@/utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requiredPermissions?: AdminPermission[];
  isProfileRoute?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAdmin = false,
  requireSuperAdmin = false,
  requiredPermissions = [],
  isProfileRoute = false,
}: ProtectedRouteProps) => {
  const { user, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Special case for profile route - allow access regardless of role
  if (isProfileRoute) {
    return <>{children}</>;
  }

  // Check for superadmin requirement first
  if (requireSuperAdmin && !(user.role === 'superadmin' || isSuperAdmin())) {
    console.log('[ProtectedRoute] Route requires superadmin, current role:', user.role);
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for admin requirement
  if (requireAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for specific role requirement
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // For superadmin users, allow access to any role-specific routes for testing purposes
    // unless it's explicitly restricted
    if (user.role === 'superadmin' || isSuperAdmin()) {
      console.log('[ProtectedRoute] Superadmin accessing route for role:', allowedRoles);
      return <>{children}</>;
    }
    
    // For non-superadmin users, redirect to their appropriate dashboard
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
