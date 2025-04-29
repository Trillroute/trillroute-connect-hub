
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import AgGridWrapper from '@/components/common/grid/AgGridWrapper';
import LoadingSpinner from '@/components/admin/courses/table/LoadingSpinner';
import { useAgGridConfig } from '@/hooks/useAgGridConfig';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Shield } from 'lucide-react';

interface AdminGridProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onView?: (admin: UserManagementUser) => void;
  onEdit?: (admin: UserManagementUser) => void; 
  onDelete?: (admin: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const AdminGrid: React.FC<AdminGridProps> = ({
  admins,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  const {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  } = useAgGridConfig<UserManagementUser>({ onBulkDelete });

  const getAdminLevelName = (level?: number) => {
    if (level === undefined) return '';
    switch (level) {
      case 0: return 'Level 0 (Super Admin)';
      case 1: return 'Level 1';
      case 2: return 'Level 2';
      case 3: return 'Level 3';
      case 4: return 'Level 4';
      case 5: return 'Level 5';
      case 6: return 'Level 6';
      case 8: return 'Level 8';
      default: return `Level ${level}`;
    }
  };

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
          <Shield className="h-4 w-4 text-music-500 mr-2" />
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
      headerName: 'Admin Level',
      field: 'adminLevel',
      filter: true,
      sortable: true,
      valueFormatter: (params) => getAdminLevelName(params.value)
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

  return (
    <div className="space-y-4 w-full">
      {selectedRows.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedRows.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <AgGridWrapper
        rowData={admins}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        loading={isLoading}
        loadingComponent={<LoadingSpinner />}
      />
    </div>
  );
};

export default AdminGrid;
