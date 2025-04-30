
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from '@/components/ui/toggle';
import { ChevronDown, ChevronUp, Filter, X, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { ColumnConfig, SortConfig } from '../types';

interface GridHeaderProps {
  columnConfigs: ColumnConfig[];
  hasSelectionColumn: boolean;
  hasActionColumn: boolean;
  sortConfig: SortConfig | null;
  filters: Record<string, string>;
  visibleFilters: Record<string, boolean>;
  selectedIds: string[];
  filteredData: any[];
  handleSelectAll: () => void;
  handleSort: (field: string) => void;
  handleFilterChange: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  toggleFilterVisibility: (field: string) => void;
}

const GridHeader: React.FC<GridHeaderProps> = ({
  columnConfigs,
  hasSelectionColumn,
  hasActionColumn,
  sortConfig,
  filters,
  visibleFilters,
  selectedIds,
  filteredData,
  handleSelectAll,
  handleSort,
  handleFilterChange,
  clearFilter,
  toggleFilterVisibility
}) => {
  return (
    <TableHeader>
      <TableRow>
        {hasSelectionColumn && (
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
                  
                  {/* Add sort buttons */}
                  {column.sortable !== false && (
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleSort(column.field)}
                      >
                        {sortConfig?.field === column.field && sortConfig?.direction === 'asc' ? (
                          <ArrowUpAZ className="h-3 w-3" />
                        ) : sortConfig?.field === column.field && sortConfig?.direction === 'desc' ? (
                          <ArrowDownAZ className="h-3 w-3" />
                        ) : (
                          <ArrowUpAZ className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
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
        
        {hasActionColumn && (
          <TableHead className="w-[120px]">Actions</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default GridHeader;
