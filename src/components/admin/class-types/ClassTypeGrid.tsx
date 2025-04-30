
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';
import { ClassType } from '@/hooks/useClassTypes';

interface ClassTypeGridProps {
  classTypes: ClassType[];
  loading: boolean;
  onEdit?: (classType: ClassType) => void;
  onDelete?: (classType: ClassType) => void;
  onView?: (classType: ClassType) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedClassTypeIds?: string[];
  setSelectedClassTypeIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const ClassTypeGrid: React.FC<ClassTypeGridProps> = ({
  classTypes,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  selectedClassTypeIds = [],
  setSelectedClassTypeIds
}) => {
  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Class Type'
    },
    {
      field: 'price_inr',
      headerName: 'Price (₹)',
      valueFormatter: ({ value }) => {
        return typeof value === 'number' ? `₹${value.toFixed(2)}` : '';
      }
    },
    {
      field: 'max_students',
      headerName: 'Max Students'
    },
    {
      field: 'duration_value',
      headerName: 'Duration',
      valueGetter: ({ data }) => {
        return `${data.duration_value} ${data.duration_metric}`;
      }
    },
    {
      field: 'location',
      headerName: 'Location'
    },
    {
      field: 'created_at',
      headerName: 'Created',
      valueFormatter: ({ value }) => {
        if (!value) return '';
        try {
          return format(new Date(value), 'MMM d, yyyy');
        } catch (error) {
          console.error('Date formatting error:', error);
          return value;
        }
      }
    }
  ], []);

  return (
    <UnifiedDataGrid
      data={classTypes}
      columnConfigs={columnConfigs}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedClassTypeIds}
      setSelectedIds={setSelectedClassTypeIds}
      emptyMessage="No class types found"
    />
  );
};

export default ClassTypeGrid;
