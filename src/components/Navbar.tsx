import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, role, isSuperAdmin } = useAuth();
  const location = useLocation();

  // Only show Home, Courses, SuperAdmin dashboard navigation when NOT on /dashboard/superadmin route
  const isSuperAdminRoute = location.pathname.startsWith('/dashboard/superadmin') && isSuperAdmin();

  // These links are hidden for SuperAdmin dashboard
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
  ].filter(() => !isSuperAdminRoute);

  // Only show dashboardOption if not superadmin dashboard route
  const dashboardLink = () => {
    if (!user) return null;

    // Prevent showing dashboard link if on superadmin dashboard
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

  const dashboardOption = dashboardLink();

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Fix for the onClick handler
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Music className="h-8 w-8 text-music-500" />
              <span className="ml-2 text-xl font-bold text-music-500">Trillroute</span>
            </Link>
          </div>
          {!isSuperAdminRoute && (
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
              >
                {isSuperAdmin() && <ShieldCheck className="mr-1 h-4 w-4" />}
                {dashboardOption.name}
              </Link>
            )}
          </div>
          )}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-music-500">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    {user.profilePhoto ? (
                      <AvatarImage src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <AvatarFallback className="bg-music-100 text-music-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>Profile</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="border-music-300 text-music-500 hover:bg-music-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login">
                  <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-music-500 text-white hover:bg-music-600">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden absolute right-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-music-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-music-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {!isSuperAdminRoute && (
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
      )}
    </nav>
  );
};

export default Navbar;
