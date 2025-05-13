
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import FilterSelector from '@/components/admin/scheduling/components/FilterSelector';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="mb-4">
        <FilterSelector
          filterType={filterType}
          setFilterType={setFilterType}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilterTypeTabs={true} // Show the filter type tabs in this view
        />
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
        <FilteredCalendar
          title="All Events"
          hasAdminAccess={hasAdminAccess}
          filterType={filterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | undefined}
          filterValues={selectedFilters}
          showFilterTabs={false} // Don't show duplicate tabs here as we're using the FilterSelector above
        />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
