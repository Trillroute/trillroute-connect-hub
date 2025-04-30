
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

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
