
import React, { useEffect } from 'react';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { CheckboxMultiSelect } from '@/components/ui/checkbox-multi-select';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectorProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters?: string[];
  setSelectedFilters?: (ids: string[]) => void;
  showFilterTypeTabs?: boolean;
  showFilterDropdown?: boolean;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  selectedFilters = [],
  setSelectedFilters = () => {},
  showFilterDropdown = true
}) => {
  // Use our custom hook to get filter options
  const { filterOptions, isLoading } = useFilterOptions({ filterType });

  const handleMultiSelectChange = (selected: string[]) => {
    console.log("MultiSelect selection changed:", selected);
    setSelectedFilters(selected);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {showFilterDropdown && filterType && (
        <CheckboxMultiSelect
          options={filterOptions}
          selected={selectedFilters}
          onChange={handleMultiSelectChange}
          placeholder={`Select ${filterType}(s)${isLoading ? ' (Loading...)' : ''}`}
          className="w-full bg-white" 
          label={`Filter by ${filterType}`}
        />
      )}
    </div>
  );
};

export default FilterSelector;
