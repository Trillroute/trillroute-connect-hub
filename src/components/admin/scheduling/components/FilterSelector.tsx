
import React, { useState, useEffect } from 'react';
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
  showFilterTypeTabs?: boolean; // Prop to control filter type tabs visibility
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters = [],
  setSelectedFilters = () => {},
  showFilterTypeTabs = true // Default to true for backward compatibility
}) => {
  // Use our custom hook to get filter options
  const { filterOptions, isLoading } = useFilterOptions({ filterType });

  // Log current state for debugging
  useEffect(() => {
    console.log('FilterSelector current state:', { 
      filterType, 
      selectedFilter, 
      selectedFilters,
      showFilterTypeTabs,
      filterOptionsCount: filterOptions.length
    });
  }, [filterType, selectedFilter, selectedFilters, showFilterTypeTabs, filterOptions]);

  // Reset selected filters when filter type changes
  useEffect(() => {
    if (filterType !== null) {
      setSelectedFilter(null);
      setSelectedFilters([]);
    }
  }, [filterType, setSelectedFilter, setSelectedFilters]);

  const handleMultiSelectChange = (selected: string[]) => {
    console.log("MultiSelect selection changed:", selected);
    
    // Ensure selected is an array
    const safeSelected = Array.isArray(selected) ? selected : [];
    
    // Update both filter states
    setSelectedFilters(safeSelected);
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

      {/* Secondary filter dropdown with multi-select - always show this when a filter type is selected */}
      {filterType && (
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
