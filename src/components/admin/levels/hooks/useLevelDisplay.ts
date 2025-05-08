
import { useState } from 'react';

export type ViewMode = 'grid' | 'table';

// Column option type
export interface ColumnOption {
  id: string;
  label: string;
}

export function useLevelDisplay() {
  // State for view mode (grid or table)
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'description', 'permissions']);
  
  // Column options for the table
  const columnOptions: ColumnOption[] = [
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'permissions', label: 'Permissions' },
  ];
  
  // Function to toggle column visibility
  const toggleColumnVisibility = (columnId: string, isVisible: boolean) => {
    if (isVisible && !visibleColumns.includes(columnId)) {
      setVisibleColumns([...visibleColumns, columnId]);
    } else if (!isVisible && visibleColumns.includes(columnId)) {
      setVisibleColumns(visibleColumns.filter(id => id !== columnId));
    }
  };
  
  return {
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumnVisibility,
    columnOptions
  };
}
