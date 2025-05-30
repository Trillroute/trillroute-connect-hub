
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { FilteredCalendar } from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';

const StudentCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  return (
    <ContentWrapper
      title="Student Calendar"
      description="View and manage schedule for students"
    >
      <div className="h-[calc(100vh-220px)]">
        <FilteredCalendar
          filterType="student"
          filterId={null}
          filterIds={[]}
          filters={{ users: [], courses: [], skills: [] }}
        />
      </div>
    </ContentWrapper>
  );
};

export default StudentCalendarContent;
