
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import AgGridWrapper from '@/components/common/grid/AgGridWrapper';
import LoadingSpinner from '@/components/admin/courses/table/LoadingSpinner';
import { useAgGridConfig } from '@/hooks/useAgGridConfig';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface StudentGridProps {
  students: UserManagementUser[];
  isLoading: boolean;
  onViewStudent: (student: UserManagementUser) => void;
  onEditStudent?: (student: UserManagementUser) => void; 
  onDeleteStudent?: (student: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  canDeleteStudent?: (student: UserManagementUser) => boolean;
}

const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  isLoading,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onBulkDelete,
  canDeleteStudent = () => true,
}) => {
  const {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  } = useAgGridConfig<UserManagementUser>({ onBulkDelete });

  // Ensure we have data to display
  console.log('Students data:', students?.length, 'Loading:', isLoading);

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
      valueGetter: (params) => {
        const data = params.data;
        return data ? `${data.firstName || ''} ${data.lastName || ''}` : '';
      },
      cellRenderer: (params) => {
        if (!params.value) return null;
        return <div className="font-semibold">{params.value}</div>;
      }
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
      sortable: false,
      filter: false,
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

  // Add additional logging to help debug
  if (isLoading) {
    console.log('Rendering loading state');
  }

  return (
    <div className="space-y-4 w-full">
      {selectedRows.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <div className="w-full" style={{ minHeight: '400px' }}>
        <AgGridWrapper
          rowData={students || []}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          loading={isLoading}
          loadingComponent={<LoadingSpinner />}
          height="500px"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StudentGrid;
