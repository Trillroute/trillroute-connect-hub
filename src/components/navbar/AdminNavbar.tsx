
import React from 'react';
import { NavbarLogo } from './NavbarLogo';
import { SuperAdminNavigation } from './SuperAdminNavigation';
import { UserActions } from './UserActions';

export const AdminNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavbarLogo />
            <SuperAdminNavigation />
          </div>
          <div className="flex items-center space-x-4">
            <UserActions />
          </div>
        </div>
      </div>
    </nav>
  );
};
