
import React from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';

const StaffCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  return (
    <ContentWrapper
      title="Staff Calendar"
      description="View and manage schedule for all staff members"
    >
      <div className="h-[calc(100vh-220px)]">
        <FilteredCalendar
          title="Staff Calendar"
          description="Events for all teachers, admins, and superadmins"
          filterType="role"
          filterValues={['teacher', 'admin', 'superadmin']}
          hasAdminAccess={hasAdminAccess}
        />
      </div>
    </ContentWrapper>
  );
};

export default StaffCalendarContent;
