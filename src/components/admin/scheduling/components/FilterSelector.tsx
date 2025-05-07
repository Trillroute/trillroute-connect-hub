
import React, { useState } from 'react';
import { FilterTypeSelector } from './filter/FilterTypeSelector';
import { FilterOptionsSelector } from './filter/FilterOptionsSelector';
import { useFilterOptions } from './filter/useFilterOptions';

interface FilterSelectorProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters: string[];
  setSelectedFilters: (ids: string[]) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters,
  setSelectedFilters
}) => {
  const [open, setOpen] = useState(false);
  const { filterOptions, loading } = useFilterOptions(filterType);

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    setSelectedFilter(null);
    setSelectedFilters([]);
  };

  const handleFilterSelect = (id: string) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(item => item !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1">
        <FilterTypeSelector
          filterType={filterType}
          onFilterTypeChange={handleFilterTypeChange}
          loading={loading}
        />
      </div>

      {filterType && (
        <div className="flex-1">
          <FilterOptionsSelector
            options={filterOptions}
            selectedOptions={selectedFilters}
            onOptionSelect={handleFilterSelect}
            filterType={filterType}
            loading={loading}
            open={open}
            setOpen={setOpen}
          />
        </div>
      )}
    </div>
  );
};

export default FilterSelector;
