
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ColumnConfig {
  field: string;
  headerName: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  valueFormatter?: ({ value, data }: { value: any, data?: any }) => string | number;
  cellRenderer?: ({ value, data }: { value: any, data: any }) => React.ReactNode;
  valueGetter?: ({ data }: { data: any }) => any;
}

export interface UnifiedDataGridProps {
  data: any[];
  columnConfigs: ColumnConfig[];
  loading?: boolean;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  height?: string;
  emptyMessage?: string;
  className?: string;
  onColumnReorder?: (draggedField: string, targetField: string) => void;
}
