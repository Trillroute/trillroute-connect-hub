
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SuperAdminNavigation = () => {
  const { isSuperAdmin } = useAuth();
  const location = useLocation();

  console.log('SuperAdminNavigation - isSuperAdmin():', isSuperAdmin());
  console.log('SuperAdminNavigation - location.pathname:', location.pathname);
  console.log('SuperAdminNavigation - includes /dashboard/student:', location.pathname.includes('/dashboard/student'));

  if (!isSuperAdmin() || !location.pathname.includes('/dashboard/student')) {
    console.log('SuperAdminNavigation - not rendering because conditions not met');
    return null;
  }

  console.log('SuperAdminNavigation - rendering navigation');

  return (
    <div className="ml-8 flex items-center space-x-6">
      <Link 
        to="/dashboard/superadmin" 
        className="text-sm font-medium text-gray-700 hover:text-music-500 transition-colors"
      >
        <ShieldCheck className="inline-block mr-1 h-4 w-4" />
        SuperAdmin Dashboard
      </Link>
      <span className="text-gray-400">•</span>
      <Link 
        to="/dashboard/student" 
        className="text-sm font-medium text-music-600 hover:text-music-700 transition-colors"
        onClick={(e) => {
          console.log('Student Dashboard link clicked');
          // Don't prevent default - let React Router handle it
        }}
      >
        Student Dashboard
      </Link>
    </div>
  );
};
