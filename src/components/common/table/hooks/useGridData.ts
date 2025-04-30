
import { useState, useMemo } from 'react';
import { ColumnConfig, SortConfig } from '../types';

interface UseGridDataProps {
  data: any[];
  columnConfigs: ColumnConfig[];
}

export const useGridData = ({ data, columnConfigs }: UseGridDataProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});

  // Toggle filter visibility for a column
  const toggleFilterVisibility = (field: string) => {
    setVisibleFilters(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Clear filter for specific column
  const clearFilter = (field: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    setSortConfig(current => {
      if (current?.field === field) {
        if (current.direction === 'asc') {
          return { field, direction: 'desc' };
        }
        // If it's already descending, remove sorting
        return null;
      }
      // Default to ascending
      return { field, direction: 'asc' };
    });
  };

  // Get cell value based on column configuration
  const getCellValue = (row: any, column: ColumnConfig): any => {
    if (column.valueGetter) {
      return column.valueGetter({ data: row });
    }
    return row[column.field];
  };

  // Format cell value if formatter provided
  const getFormattedValue = (value: any, column: ColumnConfig): any => {
    if (column.valueFormatter) {
      return column.valueFormatter({ value });
    }
    return value;
  };

  // Apply filters and sorting to data
  const filteredData = useMemo(() => {
    let result = data.filter(row => {
      return Object.entries(filters).every(([field, filterValue]) => {
        if (!filterValue || filterValue.trim() === '') return true;
        
        const column = columnConfigs.find(col => col.field === field);
        if (!column) return true;
        
        const cellValue = getCellValue(row, column);
        const formattedValue = getFormattedValue(cellValue, column);
        
        // Convert to string for comparison
        const valueStr = String(formattedValue || '').toLowerCase();
        const filterStr = filterValue.toLowerCase();
        
        return valueStr.includes(filterStr);
      });
    });
    
    // Apply sorting if configured
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const column = columnConfigs.find(col => col.field === sortConfig.field);
        if (!column) return 0;
        
        const aValue = getCellValue(a, column);
        const bValue = getCellValue(b, column);
        
        const aFormatted = getFormattedValue(aValue, column);
        const bFormatted = getFormattedValue(bValue, column);
        
        // String comparison by default
        if (aFormatted === bFormatted) return 0;
        
        const comparison = aFormatted < bFormatted ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [data, filters, columnConfigs, sortConfig]);
  
  // Check if there are active filters
  const activeFiltersCount = Object.values(filters).filter(value => value && value.trim() !== '').length;

  return {
    filteredData,
    filters,
    sortConfig,
    visibleFilters,
    activeFiltersCount,
    toggleFilterVisibility,
    handleFilterChange,
    clearFilter,
    clearAllFilters,
    handleSort,
    getCellValue,
    getFormattedValue
  };
};
