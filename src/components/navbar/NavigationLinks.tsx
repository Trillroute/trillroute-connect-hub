
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationLinksProps {
  isSuperAdminRoute: boolean;
}

export const NavigationLinks = ({ isSuperAdminRoute }: NavigationLinksProps) => {
  const { user, isSuperAdmin, role } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
  ].filter(() => !isSuperAdminRoute);

  const getDashboardLink = () => {
    if (!user) return null;

    if (isSuperAdmin() && isSuperAdminRoute) {
      return null;
    }

    if (isSuperAdmin()) {
      return { name: 'SuperAdmin Dashboard', path: '/dashboard/superadmin' };
    }

    switch(role) {
      case 'student':
        return { name: 'Student Dashboard', path: '/dashboard/student' };
      case 'teacher':
        return { name: 'Teacher Dashboard', path: '/dashboard/teacher' };
      case 'admin':
        return { name: 'Admin Dashboard', path: '/dashboard/admin' };
      default:
        return null;
    }
  };

  const dashboardOption = getDashboardLink();

  if (isSuperAdminRoute) {
    return null;
  }

  return (
    <div className="hidden md:flex md:space-x-8 absolute left-1/2 transform -translate-x-1/2">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-music-500 transition-colors"
        >
          {link.name}
        </Link>
      ))}
      {dashboardOption && (
        <Link
          to={dashboardOption.path}
          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-music-500 hover:text-music-600 transition-colors"
          onClick={(e) => {
            console.log('Dashboard link clicked:', dashboardOption.path);
            // Let React Router handle the navigation
          }}
        >
          {isSuperAdmin() && <ShieldCheck className="mr-1 h-4 w-4" />}
          {dashboardOption.name}
        </Link>
      )}
    </div>
  );
};
