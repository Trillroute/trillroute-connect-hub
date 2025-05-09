
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import FilterTypeTabs from '@/components/admin/scheduling/components/FilterTypeTabs';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterTypeChange = (type: string | null) => {
    setFilterType(type);
    setSelectedFilters([]); // Reset selected filters when filter type changes
  };

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="mb-4">
        <FilterTypeTabs
          filterType={filterType}
          setFilterType={handleFilterTypeChange}
        />
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
        <FilteredCalendar
          title="All Events"
          hasAdminAccess={hasAdminAccess}
          filterType={filterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | undefined}
          filterValues={selectedFilters}
        />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
