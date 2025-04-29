
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, User } from 'lucide-react';
import DataGrid, { DataGridColumn } from '@/components/common/table/DataGrid';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

interface StudentGridProps {
  students: UserManagementUser[];
  isLoading: boolean;
  onViewStudent: (student: UserManagementUser) => void;
  onEditStudent?: (student: UserManagementUser) => void; 
  onDeleteStudent?: (student: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteStudent?: (student: UserManagementUser) => boolean;
  selectedStudentIds?: string[];
  setSelectedStudentIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  isLoading,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onBulkDelete,
  canDeleteStudent = () => true,
  selectedStudentIds = [],
  setSelectedStudentIds
}) => {
  // Ensure we have data to display
  console.log('Students data:', students?.length, 'Loading:', isLoading);

  const handleSelectionChanged = (selectedRows: UserManagementUser[]) => {
    if (setSelectedStudentIds) {
      const ids = selectedRows.map(row => row.id);
      setSelectedStudentIds(ids);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedStudentIds.length > 0) {
      onBulkDelete(selectedStudentIds);
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
      field: 'name',
      valueGetter: (params) => {
        const data = params.data;
        return data ? `${data.firstName || ''} ${data.lastName || ''}` : '';
      },
      cellRenderer: (params) => {
        if (!params.value) return null;
        return (
          <div className="font-semibold flex items-center">
            <User className="h-4 w-4 text-blue-500 mr-1" />
            {params.value}
          </div>
        );
      }
    },
    {
      headerName: 'Email',
      field: 'email',
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
      cellRenderer: (params) => {
        if (!params.data) return null;
        
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onViewStudent(params.data)}>
              <Eye className="h-4 w-4" />
            </Button>
            {onEditStudent && (
              <Button variant="ghost" size="sm" onClick={() => onEditStudent(params.data)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDeleteStudent && canDeleteStudent(params.data) && (
              <Button variant="ghost" size="sm" onClick={() => onDeleteStudent(params.data)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ], [onViewStudent, onEditStudent, onDeleteStudent, canDeleteStudent]);

  return (
    <div className="space-y-4 w-full">
      {selectedStudentIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedStudentIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <div className="w-full rounded-md border">
        <DataGrid
          rowData={students || []}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          loading={isLoading}
          height="500px"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StudentGrid;
