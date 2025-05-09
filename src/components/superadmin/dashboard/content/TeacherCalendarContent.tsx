
import React from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useFilterPersistence } from '@/components/admin/scheduling/hooks/useFilterPersistence';

const TeacherCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  // Load persisted filter state but set initial values for this view
  const { filterState } = useFilterPersistence({
    filterType: 'teacher',
    selectedFilters: []
  });
  
  return (
    <ContentWrapper
      title="Teacher Calendar"
      description="View and manage schedule for teachers"
    >
      <div className="h-[calc(100vh-220px)]">
        <FilteredCalendar
          title="Teacher Calendar"
          filterType="role"
          filterValues={['teacher']}
          hasAdminAccess={hasAdminAccess}
        />
      </div>
    </ContentWrapper>
  );
};

export default TeacherCalendarContent;
