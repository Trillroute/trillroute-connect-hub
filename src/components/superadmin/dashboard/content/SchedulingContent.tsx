
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import { FilteredCalendar } from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import FilterSelector from '@/components/admin/scheduling/components/FilterSelector';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const [filterType, setFilterType] = useState<string | null>('teacher'); // Default to teacher filter
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  console.log('SchedulingContent: Rendering with filterType:', filterType, 'selectedFilters:', selectedFilters);

  // Handle filter changes from FilterSelector
  const handleFilterChange = (newFilterType: string | null, newFilterIds: string[]) => {
    console.log('SchedulingContent: Filter changed:', { newFilterType, newFilterIds });
    // The FilterSelector already updates the state, but we can add additional logic here if needed
  };

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
          showFilterTypeTabs={true}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
        <FilteredCalendar
          filterType={filterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | undefined}
          filterId={selectedFilter}
          filterIds={selectedFilters}
          filters={{ users: [], courses: [], skills: [] }}
        />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
