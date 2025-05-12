
import React from 'react';
import { MultiSelect, Option } from '@/components/ui/multi-select';

interface FilterDropdownProps {
  filterOptions: Option[];
  selectedFilters: string[];
  isLoading: boolean;
  filterType: string | null;
  onChange: (selected: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOptions,
  selectedFilters,
  isLoading,
  filterType,
  onChange
}) => {
  // Ensure selectedFilters is always an array
  const safeSelectedFilters = Array.isArray(selectedFilters) ? selectedFilters : [];
  
  console.log('FilterDropdown rendering with:', {
    optionsCount: filterOptions.length,
    selectedCount: safeSelectedFilters.length,
    filterType
  });
  
  return (
    <MultiSelect 
      options={filterOptions} 
      selected={safeSelectedFilters} 
      onChange={onChange} 
      placeholder={`Select ${filterType}(s)${isLoading ? ' (Loading...)' : ''}`} 
      className="w-full bg-white" 
    />
  );
};

export default FilterDropdown;
