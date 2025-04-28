
import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Pencil, Trash2, ArrowUpDown, Search } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
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
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading,
  onView,
  onEdit,
  onDelete,
  onBulkDelete
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(current => ({
      ...current,
      [key]: value
    }));
  };

  const filteredData = data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = String(item[key]).toLowerCase();
      return itemValue.includes(value.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleAllRows = () => {
    if (selectedIds.length === sortedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedData.map(row => row.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(rowId => rowId !== id)
        : [...current, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {onBulkDelete && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.length === sortedData.length && sortedData.length > 0}
                    onCheckedChange={toggleAllRows}
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead key={column.key}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {column.label}
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-mr-4"
                          onClick={() => handleSort(column.key)}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {column.filterable && (
                      <Input
                        placeholder={`Filter ${column.label}`}
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        className="h-8"
                      />
                    )}
                  </div>
                </TableHead>
              ))}
              {(onView || onEdit || onDelete) && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={row.id || index}>
                {onBulkDelete && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                  </TableCell>
                )}
                {columns.map(column => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                {(onView || onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(row)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
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
      </div>
    </div>
  );
};

export default DataTable;
