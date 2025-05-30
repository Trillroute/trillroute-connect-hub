
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
  showFilterTypeTabs?: boolean;
  onFilterChange?: (filterType: string | null, filterIds: string[]) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters = [],
  setSelectedFilters = () => {},
  showFilterTypeTabs = true,
  onFilterChange
}) => {
  // Use our custom hook to get filter options
  const { filterOptions, isLoading } = useFilterOptions({ filterType });
  const [previousFilterType, setPreviousFilterType] = useState(filterType);

  // Log current state for debugging
  useEffect(() => {
    console.log('FilterSelector current state:', { 
      filterType, 
      selectedFilter, 
      selectedFilters,
      showFilterTypeTabs,
      filterOptions: filterOptions.length
    });
  }, [filterType, selectedFilter, selectedFilters, showFilterTypeTabs, filterOptions]);

  // Only reset selected filters when filter type actually changes
  useEffect(() => {
    if (filterType !== previousFilterType) {
      console.log('FilterSelector: Filter type changed from', previousFilterType, 'to', filterType, '- clearing selections');
      setSelectedFilter(null);
      setSelectedFilters([]);
      setPreviousFilterType(filterType);
      
      // Notify parent of filter change
      if (onFilterChange) {
        onFilterChange(filterType, []);
      }
    }
  }, [filterType, previousFilterType, setSelectedFilter, setSelectedFilters, onFilterChange]);

  const handleMultiSelectChange = (selected: string[]) => {
    console.log("FilterSelector: MultiSelect selection changed:", selected);
    
    // Ensure selected is an array
    const safeSelected = Array.isArray(selected) ? selected : [];
    
    // Update the multi-select state
    setSelectedFilters(safeSelected);
    
    // Also update the single selection state for backward compatibility
    setSelectedFilter(safeSelected.length > 0 ? safeSelected[0] : null);
    
    console.log("FilterSelector: Updated selectedFilters to:", safeSelected);
    
    // Notify parent of filter change
    if (onFilterChange) {
      onFilterChange(filterType, safeSelected);
    }
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
        <div className="w-full">
          <FilterDropdown
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            isLoading={isLoading}
            filterType={filterType}
            onChange={handleMultiSelectChange}
          />
        </div>
      )}
    </div>
  );
};

export default FilterSelector;
