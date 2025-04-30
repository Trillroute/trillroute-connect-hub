
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}) => {
  // Add state to track column configurations that can be reordered
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(initialColumnConfigs);
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);

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
  } = useGridData({ data, columnConfigs });
  
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
    // Don't allow dragging the name column or action column
    const column = columnConfigs[index];
    // Check for name column or first column
    const isNameColumn = column.field === 'name' || 
                          column.field === 'title' || 
                          (index === 0 && (column.headerName === 'Name' || column.headerName.includes('Name')));
    
    if (isNameColumn || column.field.includes('action')) {
      return;
    }
    setDraggedColIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedColIndex === null || draggedColIndex === index) return;
    
    // Don't allow dropping on the name column or action column
    const targetColumn = columnConfigs[index];
    // Check for name column or first column
    const isNameColumn = targetColumn.field === 'name' || 
                          targetColumn.field === 'title' || 
                          (index === 0 && (targetColumn.headerName === 'Name' || targetColumn.headerName.includes('Name')));
    
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
      <GridToolbar 
        selectedIds={selectedIds}
        activeFiltersCount={activeFiltersCount}
        onBulkDelete={onBulkDelete ? () => handleBulkDelete(onBulkDelete) : undefined}
        clearAllFilters={clearAllFilters}
      />

      <div className={`w-full rounded-md border overflow-hidden ${className}`}>
        <div style={{ height }}>
          <ScrollArea className="h-full">
            <Table>
              <GridHeader 
                columnConfigs={columnConfigs}
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
                columnConfigs={columnConfigs}
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
