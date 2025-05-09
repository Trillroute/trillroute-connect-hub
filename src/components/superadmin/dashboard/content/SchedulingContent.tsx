
import React from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import FilterSelector from '@/components/admin/scheduling/components/FilterSelector';
import { useFilterPersistence } from '@/components/admin/scheduling/hooks/useFilterPersistence';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const { filterState, updateFilterState } = useFilterPersistence();
  const { filterType, selectedFilter, selectedFilters } = filterState;

  // Handle filter type changes
  const handleFilterTypeChange = (newType: string | null) => {
    updateFilterState({ 
      filterType: newType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null
    });
  };

  // Handle filter selection changes
  const handleSelectedFilterChange = (newFilter: string | null) => {
    updateFilterState({ selectedFilter: newFilter });
  };

  // Handle multi-filter selection changes
  const handleSelectedFiltersChange = (newFilters: string[]) => {
    updateFilterState({ selectedFilters: newFilters });
  };

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="mb-4">
        <FilterSelector
          filterType={filterType}
          setFilterType={handleFilterTypeChange}
          selectedFilter={selectedFilter}
          setSelectedFilter={handleSelectedFilterChange}
          selectedFilters={selectedFilters}
          setSelectedFilters={handleSelectedFiltersChange}
          showFilterTypeTabs={true}
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
