
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

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
  // Handle row selection
  const handleRowSelection = (id: string) => {
    if (!setSelectedIds) return;
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (!setSelectedIds) return;
    
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      const allIds = data.map(item => item.id);
      setSelectedIds(allIds);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
  };

  // Get cell value based on column configuration
  const getCellValue = (row: any, column: ColumnConfig): any => {
    if (column.valueGetter) {
      return column.valueGetter({ data: row });
    }
    return row[column.field];
  };

  // Format cell value if formatter provided
  const getFormattedValue = (value: any, column: ColumnConfig): any => {
    if (column.valueFormatter) {
      return column.valueFormatter({ value });
    }
    return value;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {selectedIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div className={`w-full rounded-md border overflow-hidden ${className}`}>
        <div style={{ height }}>
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {setSelectedIds && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === data.length && data.length > 0}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  
                  {columnConfigs.map((column, index) => (
                    <TableHead 
                      key={index} 
                      style={column.width ? { width: column.width } : {}}
                    >
                      {column.headerName}
                    </TableHead>
                  ))}
                  
                  {(onView || onEdit || onDelete) && (
                    <TableHead className="w-[120px]">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={(onView || onEdit || onDelete ? columnConfigs.length + 2 : columnConfigs.length + 1)}
                      className="text-center py-8"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      {setSelectedIds && (
                        <TableCell>
                          <Checkbox 
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => handleRowSelection(row.id)}
                          />
                        </TableCell>
                      )}
                      
                      {columnConfigs.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.cellRenderer ? (
                            column.cellRenderer({ 
                              data: row, 
                              value: getCellValue(row, column)
                            })
                          ) : (
                            getFormattedValue(getCellValue(row, column), column)
                          )}
                        </TableCell>
                      ))}
                      
                      {(onView || onEdit || onDelete) && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {onView && (
                              <Button variant="ghost" size="sm" onClick={() => onView(row)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {onEdit && (
                              <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDataGrid;
