
import React from 'react';
import { Course } from '@/types/course';
import { format } from 'date-fns';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedCourseIds?: string[];
  setSelectedCourseIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  selectedCourseIds = [],
  setSelectedCourseIds
}) => {
  // Define column configurations
  const columnConfigs: ColumnConfig[] = [
    {
      field: 'title',
      headerName: 'Name',
      cellRenderer: ({ data }) => (
        <span className="font-medium">{data.title}</span>
      )
    },
    {
      field: 'category',
      headerName: 'Category'
    },
    {
      field: 'final_price',
      headerName: 'Price',
      valueFormatter: ({ value }) => {
        return typeof value === 'number' ? `₹${value.toFixed(2)}` : '';
      }
    },
    {
      field: 'created_at',
      headerName: 'Created',
      valueFormatter: ({ value }) => {
        return value ? format(new Date(value), 'MMM d, yyyy') : '';
      }
    }
  ];

  return (
    <UnifiedDataGrid
      data={courses}
      columnConfigs={columnConfigs}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedCourseIds}
      setSelectedIds={setSelectedCourseIds}
      emptyMessage="No courses found"
    />
  );
};

export default CourseTable;
