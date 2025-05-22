
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGridData } from './hooks/useGridData';
import { useGridSelection } from './hooks/useGridSelection';
import { useColumnReordering } from './hooks/useColumnReordering';
import { useColumnVisibility } from './hooks/useColumnVisibility';
import GridHeader from './components/GridHeader';
import GridBody from './components/GridBody';
import GridToolbar from './components/GridToolbar';
import LoadingIndicator from './components/LoadingIndicator';
import ColumnVisibilityMenu from './components/ColumnVisibilityMenu';
import { UnifiedDataGridProps } from './types';

// Re-export for convenience
export type { ColumnConfig, UnifiedDataGridProps } from './types';

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
  // Use custom hooks for column and visibility management
  const { columnVisibility, toggleColumnVisibility } = useColumnVisibility(initialColumnConfigs);
  const { 
    columnConfigs, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd 
  } = useColumnReordering(initialColumnConfigs, onColumnReorder);

  // Filter visible columns
  const visibleColumnConfigs = useMemo(() => {
    return columnConfigs.filter(column => {
      // Always show the first column (usually name/identifier)
      if (column.field === columnConfigs[0]?.field) return true;
      return columnVisibility[column.field] !== false;
    });
  }, [columnConfigs, columnVisibility]);

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
        {showColumnVisibilityDropdown && (
          <ColumnVisibilityMenu
            columnConfigs={columnConfigs}
            columnVisibility={columnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
          />
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
