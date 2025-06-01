
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NavbarLogo } from './navbar/NavbarLogo';
import { NavigationLinks } from './navbar/NavigationLinks';
import { UserActions } from './navbar/UserActions';
import { MobileMenu } from './navbar/MobileMenu';
import { MobileMenuToggle } from './navbar/MobileMenuToggle';
import { AdminNavbar } from './navbar/AdminNavbar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSuperAdmin, user } = useAuth();
  const location = useLocation();

  const isSuperAdminRoute = location.pathname.startsWith('/dashboard/superadmin') && isSuperAdmin();
  const isAdminRoute = 
    location.pathname.includes('/dashboard/admin') ||
    location.pathname.includes('/dashboard/superadmin') ||
    location.pathname.includes('/admin');
  
  // Use AdminNavbar only for actual admin routes, not student dashboard
  const isStudentDashboard = location.pathname.includes('/dashboard/student') && user?.role === 'student';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Only use AdminNavbar for admin/superadmin routes, not student dashboard
  if (isAdminRoute && !isStudentDashboard) {
    return <AdminNavbar />;
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavbarLogo />
          </div>
          <NavigationLinks isSuperAdminRoute={isSuperAdminRoute} />
          <div className="hidden md:flex md:items-center md:space-x-4">
            <UserActions />
          </div>
          <MobileMenuToggle isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </div>
      <MobileMenu 
        isMenuOpen={isMenuOpen} 
        isSuperAdminRoute={isSuperAdminRoute} 
        setIsMenuOpen={setIsMenuOpen} 
      />
    </nav>
  );
};

export default Navbar;
