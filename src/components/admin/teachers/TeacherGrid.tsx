
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import AgGridWrapper from '@/components/common/grid/AgGridWrapper';
import LoadingSpinner from '@/components/admin/courses/table/LoadingSpinner';
import { useAgGridConfig } from '@/hooks/useAgGridConfig';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, UserCog } from 'lucide-react';

interface TeacherGridProps {
  teachers: UserManagementUser[];
  isLoading: boolean;
  onViewTeacher: (teacher: UserManagementUser) => void;
  onEditTeacher?: (teacher: UserManagementUser) => void; 
  onDeleteTeacher?: (teacher: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteTeacher?: (teacher: UserManagementUser) => boolean;
}

const TeacherGrid: React.FC<TeacherGridProps> = ({
  teachers,
  isLoading,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onBulkDelete,
  canDeleteTeacher = () => true,
}) => {
  const {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  } = useAgGridConfig<UserManagementUser>({ onBulkDelete });

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: '',
      field: 'id',
      width: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      sortable: false,
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
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
      filter: true,
      sortable: true
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      filter: true,
      sortable: true,
      valueFormatter: (params) => format(new Date(params.value), 'MMM d, yyyy')
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
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
      {selectedRows.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <AgGridWrapper
        rowData={teachers}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        loading={isLoading}
        loadingComponent={<LoadingSpinner />}
      />
    </div>
  );
};

export default TeacherGrid;
