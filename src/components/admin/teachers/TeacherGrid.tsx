
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, UserCog } from 'lucide-react';
import DataGrid, { DataGridColumn } from '@/components/common/table/DataGrid';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

interface TeacherGridProps {
  teachers: UserManagementUser[];
  isLoading: boolean;
  onViewTeacher: (teacher: UserManagementUser) => void;
  onEditTeacher?: (teacher: UserManagementUser) => void; 
  onDeleteTeacher?: (teacher: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteTeacher?: (teacher: UserManagementUser) => boolean;
  selectedTeacherIds?: string[];
  setSelectedTeacherIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TeacherGrid: React.FC<TeacherGridProps> = ({
  teachers,
  isLoading,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onBulkDelete,
  canDeleteTeacher = () => true,
  selectedTeacherIds = [],
  setSelectedTeacherIds
}) => {
  const handleSelectionChanged = (selectedRows: UserManagementUser[]) => {
    if (setSelectedTeacherIds) {
      const ids = selectedRows.map(row => row.id);
      setSelectedTeacherIds(ids);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedTeacherIds.length > 0) {
      onBulkDelete(selectedTeacherIds);
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
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      cellRenderer: (params) => (
        <div className="font-medium flex items-center">
          <UserCog className="h-4 w-4 text-music-400 mr-1" />
          {params.value}
        </div>
      )
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
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onViewTeacher(params.data)}>
            <Eye className="h-4 w-4" />
          </Button>
          {onEditTeacher && (
            <Button variant="ghost" size="sm" onClick={() => onEditTeacher(params.data)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDeleteTeacher && canDeleteTeacher(params.data) && (
            <Button variant="ghost" size="sm" onClick={() => onDeleteTeacher(params.data)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ], [onViewTeacher, onEditTeacher, onDeleteTeacher, canDeleteTeacher]);

  return (
    <div className="space-y-4 w-full">
      {selectedTeacherIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedTeacherIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <div className="w-full rounded-md border">
        <DataGrid
          rowData={teachers}
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

export default TeacherGrid;
