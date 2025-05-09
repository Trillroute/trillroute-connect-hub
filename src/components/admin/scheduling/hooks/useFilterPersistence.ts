
import { useState, useEffect } from 'react';

// Define types for the filter state
export type FilterState = {
  filterType: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  selectedFilter: string | null;
  selectedFilters: string[];
};

// Hook to manage persisted filter state
export const useFilterPersistence = (initialState?: Partial<FilterState>) => {
  // Try to load from sessionStorage on initial render
  const loadInitialState = (): FilterState => {
    try {
      const savedFilters = sessionStorage.getItem('calendarFilters');
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error('Failed to load filters from session storage:', error);
    }
    
    // Default state if nothing in storage or parsing fails
    return {
      filterType: initialState?.filterType || null,
      selectedFilter: initialState?.selectedFilter || null,
      selectedFilters: initialState?.selectedFilters || [],
    };
  };

  const [filterState, setFilterState] = useState<FilterState>(loadInitialState);

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    try {
      sessionStorage.setItem('calendarFilters', JSON.stringify(filterState));
    } catch (error) {
      console.error('Failed to save filters to session storage:', error);
    }
  }, [filterState]);

  // Update filter state
  const updateFilterState = (newState: Partial<FilterState>) => {
    setFilterState(prevState => ({ ...prevState, ...newState }));
  };

  return {
    filterState,
    updateFilterState,
  };
};
