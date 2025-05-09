
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
        <FilteredCalendar
          title="All Events"
          hasAdminAccess={hasAdminAccess}
          filterType="unit"
          filterValues={selectedFilters}
        />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
