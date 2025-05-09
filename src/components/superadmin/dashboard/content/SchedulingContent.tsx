
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { CheckboxMultiSelect } from '@/components/ui/checkbox-multi-select';
import { useFilterOptions } from '@/components/admin/scheduling/hooks/useFilterOptions';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { filterOptions, isLoading } = useFilterOptions({ filterType: 'unit' });

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="mb-4">
        <CheckboxMultiSelect
          options={filterOptions}
          selected={selectedFilters}
          onChange={setSelectedFilters}
          placeholder={`Select units${isLoading ? ' (Loading...)' : ''}`}
          className="w-full bg-white" 
          label="Filter by department unit"
        />
      </div>
      
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
