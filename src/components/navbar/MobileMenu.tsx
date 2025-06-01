
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isMenuOpen: boolean;
  isSuperAdminRoute: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const MobileMenu = ({ isMenuOpen, isSuperAdminRoute, setIsMenuOpen }: MobileMenuProps) => {
  const { user, logout, isSuperAdmin, role } = useAuth();

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

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  if (isSuperAdminRoute) {
    return null;
  }

  return (
    <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
      <div className="pt-2 pb-3 space-y-1 flex flex-col items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        {dashboardOption && (
          <Link
            to={dashboardOption.path}
            className="block px-4 py-2 text-base font-medium text-music-500 hover:text-music-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            {isSuperAdmin() && <ShieldCheck className="inline-block mr-1 h-4 w-4" />}
            {dashboardOption.name}
          </Link>
        )}
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col items-center">
        {user ? (
          <div className="space-y-1 w-full text-center">
            <Link
              to="/profile"
              className="flex items-center justify-center px-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Avatar className="h-8 w-8 mr-2 border border-gray-200">
                {user.profilePhoto ? (
                  <AvatarImage src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  <AvatarFallback className="bg-music-100 text-music-600">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-1 w-full text-center">
            <Link
              to="/auth/login"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
