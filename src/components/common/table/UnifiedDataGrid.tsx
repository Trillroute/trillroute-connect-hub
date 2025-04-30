
import React from 'react';
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
import { UnifiedDataGridProps } from './types';

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
