
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { FilteredCalendar } from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';

const AdminCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  return (
    <ContentWrapper
      title="Admin Calendar"
      description="View and manage schedule for admins and superadmins"
    >
      <div className="h-[calc(100vh-220px)]">
        <FilteredCalendar
          filterType="admin"
          filterId={null}
          filterIds={[]}
          filters={{ users: [], courses: [], skills: [] }}
        />
      </div>
    </ContentWrapper>
  );
};

export default AdminCalendarContent;
