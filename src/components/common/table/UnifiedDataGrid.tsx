
import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';
import { Toggle } from '@/components/ui/toggle';

export interface ColumnConfig {
  field: string;
  headerName: string;
  width?: number | string;
  cellRenderer?: (params: any) => React.ReactNode;
  valueGetter?: (params: any) => any;
  valueFormatter?: (params: any) => string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface UnifiedDataGridProps {
  data: any[];
  columnConfigs: ColumnConfig[];
  loading?: boolean;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  height?: string;
  rowIcon?: React.ReactNode;
  headerTitle?: string;
  emptyMessage?: string;
  className?: string;
}

const UnifiedDataGrid: React.FC<UnifiedDataGridProps> = ({
  data,
  columnConfigs,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  selectedIds = [],
  setSelectedIds,
  height = "500px",
  emptyMessage = "No data available",
  className = "",
}) => {
  // Add state for filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{field: string, direction: 'asc' | 'desc'} | null>(null);
  // Add state to track which filter inputs are visible
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});

  // Toggle filter visibility for a column
  const toggleFilterVisibility = (field: string) => {
    setVisibleFilters(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle row selection
  const handleRowSelection = (id: string) => {
    if (!setSelectedIds) return;
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (!setSelectedIds) return;
    
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      const allIds = filteredData.map(item => item.id);
      setSelectedIds(allIds);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
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

  // Apply filters to data
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        {selectedIds.length > 0 && onBulkDelete && (
          <BulkDeleteButton 
            selectedCount={selectedIds.length}
            onBulkDelete={handleBulkDelete}
          />
        )}
        
        <div className="flex-1"></div>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="flex items-center gap-1 mr-2"
          >
            <X className="h-4 w-4" />
            <span>Clear all filters ({activeFiltersCount})</span>
          </Button>
        )}
      </div>

      <div className={`w-full rounded-md border overflow-hidden ${className}`}>
        <div style={{ height }}>
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {setSelectedIds && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < filteredData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  
                  {columnConfigs.map((column, index) => (
                    <TableHead 
                      key={index} 
                      style={column.width ? { width: column.width } : {}}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div 
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => column.sortable !== false && handleSort(column.field)}
                            >
                              <span>{column.headerName}</span>
                              {sortConfig?.field === column.field && (
                                sortConfig?.direction === 'asc' ? 
                                  <ChevronUp className="h-3 w-3" /> : 
                                  <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                            
                            {column.filterable !== false && (
                              <Toggle 
                                variant="outline" 
                                size="sm" 
                                pressed={visibleFilters[column.field]} 
                                onPressedChange={() => toggleFilterVisibility(column.field)}
                              >
                                <Filter className="h-3 w-3" />
                              </Toggle>
                            )}
                          </div>
                          
                          {filters[column.field] && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => clearFilter(column.field)}
                              className="h-5 w-5 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {column.filterable !== false && visibleFilters[column.field] && (
                          <Input
                            value={filters[column.field] || ''}
                            onChange={(e) => handleFilterChange(column.field, e.target.value)}
                            placeholder={`Filter...`}
                            className="h-7 text-xs"
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                  
                  {(onView || onEdit || onDelete) && (
                    <TableHead className="w-[120px]">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={(onView || onEdit || onDelete ? columnConfigs.length + 2 : columnConfigs.length + 1)}
                      className="text-center py-8"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={row.id}>
                      {setSelectedIds && (
                        <TableCell>
                          <Checkbox 
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => handleRowSelection(row.id)}
                          />
                        </TableCell>
                      )}
                      
                      {columnConfigs.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.cellRenderer ? (
                            column.cellRenderer({ 
                              data: row, 
                              value: getCellValue(row, column)
                            })
                          ) : (
                            getFormattedValue(getCellValue(row, column), column)
                          )}
                        </TableCell>
                      ))}
                      
                      {(onView || onEdit || onDelete) && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {onView && (
                              <Button variant="ghost" size="sm" onClick={() => onView(row)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {onEdit && (
                              <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDataGrid;
