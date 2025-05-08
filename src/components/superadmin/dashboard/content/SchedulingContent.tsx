
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

  console.log("SchedulingContent rendering with:", { 
    filterType, 
    selectedFilter, 
    selectedFilters, 
    hasAdminAccess 
  });

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
        />
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
        <FilteredCalendar
          title="All Events"
          hasAdminAccess={hasAdminAccess}
          filterType={filterType as 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'staff' | undefined}
          filterValues={selectedFilters}
        />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
