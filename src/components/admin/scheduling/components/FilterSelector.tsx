
import React, { useEffect } from 'react';
import FilterTypeTabs from './FilterTypeTabs';
import FilterDropdown from './FilterDropdown';
import { useFilterOptions } from '../hooks/useFilterOptions';

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
  showFilterDropdown?: boolean; // New prop to control dropdown visibility
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters = [],
  setSelectedFilters = () => {},
  showFilterTypeTabs = true,
  showFilterDropdown = false // Default to false to hide the dropdown
}) => {
  // Use our custom hook to get filter options
  const { filterOptions, isLoading } = useFilterOptions({ filterType });

  // Reset selected filters when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
    setSelectedFilters([]);
  }, [filterType, setSelectedFilter, setSelectedFilters]);

  const handleMultiSelectChange = (selected: string[]) => {
    console.log("MultiSelect selection changed:", selected);
    
    // Ensure selected is an array
    const safeSelected = Array.isArray(selected) ? selected : [];
    
    setSelectedFilters(safeSelected);
    
    // Also update the single selection state for backward compatibility
    setSelectedFilter(safeSelected.length > 0 ? safeSelected[0] : null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Only render filter type tabs if showFilterTypeTabs is true */}
      {showFilterTypeTabs && (
        <FilterTypeTabs 
          filterType={filterType} 
          setFilterType={setFilterType} 
        />
      )}

      {/* Only show filter dropdown if specifically requested */}
      {showFilterDropdown && filterType && (
        <FilterDropdown
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          isLoading={isLoading}
          filterType={filterType}
          onChange={handleMultiSelectChange}
        />
      )}
    </div>
  );
};

export default FilterSelector;
