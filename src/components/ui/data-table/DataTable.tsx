
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBulkDelete?: (ids: string[]) => void;
  getRowId?: (row: any) => string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  getRowId = (row) => row.id,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.key));
  const [isReordering, setIsReordering] = useState(false);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(current => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredData.map(row => getRowId(row)) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(currentId => currentId !== id)
        : [...current, id]
    );
  };

  const handleColumnReorder = (draggedKey: string, targetKey: string) => {
    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedKey);
    const targetIndex = newOrder.indexOf(targetKey);
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedKey);
    setColumnOrder(newOrder);
  };

  // Apply filters and sorting
  let filteredData = [...data];
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      filteredData = filteredData.filter(row => {
        const cellValue = row[key]?.toString().toLowerCase();
        return cellValue?.includes(value.toLowerCase());
      });
    }
  });

  // Apply sorting
  if (sortConfig) {
    filteredData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && onBulkDelete && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedIds)}
          >
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onBulkDelete && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredData.length > 0 &&
                      filteredData.every(row => selectedIds.includes(getRowId(row)))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columnOrder.map(key => {
                const column = columns.find(col => col.key === key)!;
                return (
                  <TableHead
                    key={column.key}
                    className="min-w-[150px]"
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      <DragHandleDots2Icon
                        className="h-4 w-4 cursor-move"
                        onMouseDown={() => setIsReordering(true)}
                        onMouseUp={() => setIsReordering(false)}
                      />
                      <div className="flex-1">
                        {column.label}
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="ml-2"
                          >
                            ↕️
                          </button>
                        )}
                      </div>
                      {column.filterable && (
                        <Input
                          placeholder={`Filter ${column.label}`}
                          value={filters[column.key] || ''}
                          onChange={e => handleFilter(column.key, e.target.value)}
                          className="h-8 w-[150px]"
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}
              {(onView || onEdit || onDelete) && (
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={getRowId(row)}>
                {onBulkDelete && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(getRowId(row))}
                      onCheckedChange={() => handleSelectOne(getRowId(row))}
                    />
                  </TableCell>
                )}
                {columnOrder.map(key => {
                  const column = columns.find(col => col.key === key)!;
                  const value = row[column.key];
                  return (
                    <TableCell key={column.key}>
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
                {(onView || onEdit || onDelete) && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(row)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default DataTable;
