
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns } from "lucide-react";
import { useGridData } from './hooks/useGridData';
import { useGridSelection } from './hooks/useGridSelection';
import GridHeader from './components/GridHeader';
import GridBody from './components/GridBody';
import GridToolbar from './components/GridToolbar';
import LoadingIndicator from './components/LoadingIndicator';
import { UnifiedDataGridProps, ColumnConfig } from './types';

// Re-export the types so they can be imported from this file
export type { ColumnConfig, UnifiedDataGridProps };

const UnifiedDataGrid: React.FC<UnifiedDataGridProps> = ({
  data,
  columnConfigs: initialColumnConfigs,
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
  onColumnReorder,
  showColumnVisibilityDropdown = true,
}) => {
  // Add state to track column configurations that can be reordered
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(initialColumnConfigs);
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
  
  // Add state to track column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    initialColumnConfigs.reduce((acc, column) => {
      acc[column.field] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Filter columns based on visibility
  const visibleColumnConfigs = useMemo(() => {
    return columnConfigs.filter(column => {
      // Always show the first column (usually name/identifier)
      if (column.field === columnConfigs[0]?.field) return true;
      return columnVisibility[column.field] !== false;
    });
  }, [columnConfigs, columnVisibility]);

  // Update column visibility
  const toggleColumnVisibility = (field: string, isVisible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: isVisible
    }));
  };

  // Use our custom hooks to manage grid data and selection
  const {
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
  } = useGridData({ data, columnConfigs: visibleColumnConfigs });
  
  const {
    handleRowSelection,
    handleSelectAll,
    handleBulkDelete
  } = useGridSelection({ 
    selectedIds, 
    setSelectedIds,
    data: filteredData 
  });

  const hasSelectionColumn = !!setSelectedIds;
  const hasActionColumn = !!(onView || onEdit || onDelete);
  
  // Column drag handlers
  const handleDragStart = (index: number) => {
    // Check if the column should be draggable
    const column = columnConfigs[index];
    
    // Define non-draggable columns
    const isNameColumn = 
      column.field === 'name' || 
      column.field === 'title' ||
      column.headerName === 'Name' ||
      column.headerName.includes('Name') ||
      index === 0;  // First column is usually a name/identifier
    
    if (isNameColumn || column.field.includes('action')) {
      return;
    }
    
    setDraggedColIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedColIndex === null || draggedColIndex === index) return;
    
    // Don't allow dropping on protected columns
    const targetColumn = columnConfigs[index];
    const isNameColumn = 
      targetColumn.field === 'name' || 
      targetColumn.field === 'title' ||
      targetColumn.headerName === 'Name' ||
      targetColumn.headerName.includes('Name') ||
      index === 0;  // First column is usually a name/identifier
    
    if (isNameColumn || targetColumn.field.includes('action')) {
      return;
    }

    // Create a new array with reordered columns
    const newColumnConfigs = [...columnConfigs];
    const draggedColumn = newColumnConfigs[draggedColIndex];
    
    // Remove the dragged column
    newColumnConfigs.splice(draggedColIndex, 1);
    // Insert it at the new position
    newColumnConfigs.splice(index, 0, draggedColumn);
    
    // Update the dragged column index
    setDraggedColIndex(index);
    // Update the column configs
    setColumnConfigs(newColumnConfigs);
    
    // If external reorder handler exists, call it
    if (onColumnReorder) {
      onColumnReorder(draggedColumn.field, targetColumn.field);
    }
  };

  const handleDragEnd = () => {
    setDraggedColIndex(null);
  };

  // Loading state
  if (loading) {
    return <LoadingIndicator height={height} />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <GridToolbar 
          selectedIds={selectedIds}
          activeFiltersCount={activeFiltersCount}
          onBulkDelete={onBulkDelete ? () => handleBulkDelete(onBulkDelete) : undefined}
          clearAllFilters={clearAllFilters}
        />
        
        {/* Column visibility dropdown */}
        {showColumnVisibilityDropdown && columnConfigs.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto flex items-center gap-1"
              >
                <Columns className="h-4 w-4" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              {columnConfigs.map((column, index) => (
                <DropdownMenuCheckboxItem
                  key={column.field}
                  checked={columnVisibility[column.field] !== false}
                  onCheckedChange={(checked) => toggleColumnVisibility(column.field, checked)}
                  disabled={index === 0} // Disable first column (usually name or ID)
                >
                  {column.headerName}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className={`w-full rounded-md border overflow-hidden ${className}`}>
        <div style={{ height }}>
          <ScrollArea className="h-full">
            <Table>
              <GridHeader 
                columnConfigs={visibleColumnConfigs}
                hasSelectionColumn={hasSelectionColumn}
                hasActionColumn={hasActionColumn}
                sortConfig={sortConfig}
                filters={filters}
                visibleFilters={visibleFilters}
                selectedIds={selectedIds}
                filteredData={filteredData}
                handleSelectAll={() => handleSelectAll(filteredData)}
                handleSort={handleSort}
                handleFilterChange={handleFilterChange}
                clearFilter={clearFilter}
                toggleFilterVisibility={toggleFilterVisibility}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
              
              <GridBody 
                data={filteredData}
                columnConfigs={visibleColumnConfigs}
                emptyMessage={emptyMessage}
                hasSelectionColumn={hasSelectionColumn}
                hasActionColumn={hasActionColumn}
                selectedIds={selectedIds}
                getCellValue={getCellValue}
                getFormattedValue={getFormattedValue}
                handleRowSelection={handleRowSelection}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDataGrid;
