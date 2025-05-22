
import { ReactNode } from 'react';

export interface ColumnConfig {
  field: string;
  headerName: string;
  valueGetter?: ({ data }: { data: any }) => any;
  valueFormatter?: ({ value }: { value: any }) => any;
  cellRenderer?: ({ data, value }: { data: any; value: any }) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  flex?: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
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
  emptyMessage?: string;
  className?: string;
  onColumnReorder?: (draggedField: string, targetField: string) => void;
  showColumnVisibilityDropdown?: boolean;
}
