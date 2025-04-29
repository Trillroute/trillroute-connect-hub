
import React, { useMemo } from 'react';
import { Course } from '@/types/course';
import BulkDeleteButton from './table/BulkDeleteButton';
import LoadingSpinner from './table/LoadingSpinner';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataGrid, { DataGridColumn } from '@/components/common/table/DataGrid';
import { format } from 'date-fns';

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
  const handleSelectionChanged = (selectedRows: Course[]) => {
    if (setSelectedCourseIds) {
      const ids = selectedRows.map(row => row.id);
      setSelectedCourseIds(ids);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedCourseIds.length > 0) {
      onBulkDelete(selectedCourseIds);
    }
  };

  const columnDefs = useMemo<DataGridColumn[]>(() => [
    {
      headerName: '',
      field: 'id',
      width: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'Name',
      field: 'title',
    },
    {
      headerName: 'Category',
      field: 'category',
    },
    {
      headerName: 'Price',
      field: 'price',
      valueFormatter: (params) => {
        if (typeof params.value !== 'number') return '';
        return `₹${params.value.toFixed(2)}`;
      }
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      valueFormatter: (params) => {
        if (!params.value) return '';
        try {
          return format(new Date(params.value), 'MMM d, yyyy');
        } catch (error) {
          console.error('Date formatting error:', error);
          return params.value;
        }
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(params.data)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(params.data)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(params.data)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ], [onView, onEdit, onDelete]);

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('Rendering DataGrid with courses:', courses?.length);
  
  return (
    <div className="space-y-4 w-full">
      {selectedCourseIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedCourseIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div className="w-full rounded-md border">
        <DataGrid
          rowData={courses || []}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          loading={loading}
          height="600px"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CourseTable;
