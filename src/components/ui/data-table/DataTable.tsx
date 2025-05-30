
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Column, DataTableProps } from './types';
import DataTableFilters from './DataTableFilters';
import DataTableActions from './DataTableActions';
import DataTableLoading from './DataTableLoading';

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  selectedIds,
  setSelectedIds
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const localSelectedIds = selectedIds || [];
  const localSetSelectedIds = setSelectedIds || (() => {});

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

  const toggleAllRows = () => {
    if (localSelectedIds.length === filteredData.length) {
      localSetSelectedIds([]);
    } else {
      localSetSelectedIds(filteredData.map(row => row.id));
    }
  };

  const toggleRow = (id: string) => {
    localSetSelectedIds(current =>
      current.includes(id)
        ? current.filter(rowId => rowId !== id)
        : [...current, id]
    );
  };

  if (loading) {
    return <DataTableLoading />;
  }

  return (
    <div className="space-y-4">
      {localSelectedIds.length > 0 && onBulkDelete && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(localSelectedIds)}
          >
            Delete Selected ({localSelectedIds.length})
          </Button>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {onBulkDelete && setSelectedIds && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={localSelectedIds.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={toggleAllRows}
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead key={column.key}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {column.label}
                    </div>
                    <DataTableFilters
                      column={column}
                      value={filters[column.key] || ''}
                      onChange={(value) => handleFilter(column.key, value)}
                    />
                  </div>
                </TableHead>
              ))}
              {(onView || onEdit || onDelete) && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id || index}>
                {onBulkDelete && setSelectedIds && (
                  <TableCell>
                    <Checkbox
                      checked={localSelectedIds.includes(row.id)}
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
                    <DataTableActions
                      row={row}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
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
