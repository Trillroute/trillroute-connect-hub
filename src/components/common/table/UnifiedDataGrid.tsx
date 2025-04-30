
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
import { Eye, Pencil, Trash2, Filter, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

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
  const [showFilters, setShowFilters] = useState(false);

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
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(row => {
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
  }, [data, filters, columnConfigs]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  // Check if there are active filters
  const activeFiltersCount = Object.values(filters).filter(value => value && value.trim() !== '').length;

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
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-1 ml-auto relative"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="border p-3 rounded-md mb-2 bg-card shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Filters</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 px-2 text-sm"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columnConfigs.map((column, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {column.headerName}
                </label>
                <Input
                  value={filters[column.field] || ''}
                  onChange={(e) => handleFilterChange(column.field, e.target.value)}
                  placeholder={`Filter ${column.headerName.toLowerCase()}`}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
                      {column.headerName}
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
