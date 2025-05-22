
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, ArrowDown, Filter } from 'lucide-react';
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
  handleSelectAll: (data: any[]) => void;
  handleSort: (field: string) => void;
  handleFilterChange: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  toggleFilterVisibility: (field: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
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
  toggleFilterVisibility,
  onDragStart,
  onDragOver,
  onDragEnd
}) => {
  return (
    <TableHeader>
      <TableRow>
        {/* Selection column */}
        {hasSelectionColumn && (
          <TableHead className="w-[50px] relative">
            <Checkbox 
              checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
              onCheckedChange={() => handleSelectAll(filteredData)}
            />
          </TableHead>
        )}
        
        {/* Data columns */}
        {columnConfigs.map((column, index) => (
          <TableHead 
            key={column.field}
            className="relative"
            draggable 
            onDragStart={() => onDragStart(index)}
            onDragOver={() => onDragOver(index)}
            onDragEnd={onDragEnd}
            style={column.width ? { width: column.width } : {}}
          >
            <div>
              {/* Column header with sort */}
              <button 
                className="w-full text-left flex items-center justify-between group hover:text-primary transition-colors"
                onClick={() => handleSort(column.field)}
              >
                <span>{column.headerName}</span>
                {sortConfig?.field === column.field && (
                  sortConfig.direction === 'asc' 
                    ? <ArrowUp className="h-4 w-4" /> 
                    : <ArrowDown className="h-4 w-4" />
                )}
              </button>
              
              {/* Filter toggle button */}
              <div className="flex justify-between items-center mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleFilterVisibility(column.field)}
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Filter input */}
              {visibleFilters[column.field] && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <Input
                      placeholder={`Filter ${column.headerName.toLowerCase()}...`}
                      value={filters[column.field] || ''}
                      onChange={(e) => handleFilterChange(column.field, e.target.value)}
                      className="h-7 text-xs"
                    />
                    {filters[column.field] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 ml-1"
                        onClick={() => clearFilter(column.field)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TableHead>
        ))}
        
        {/* Actions column */}
        {hasActionColumn && (
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default GridHeader;
