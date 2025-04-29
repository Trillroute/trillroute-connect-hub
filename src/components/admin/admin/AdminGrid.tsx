
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Shield } from 'lucide-react';
import DataGrid, { DataGridColumn } from '@/components/common/table/DataGrid';
import BulkDeleteButton from '@/components/admin/courses/table/BulkDeleteButton';

interface AdminGridProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onView?: (admin: UserManagementUser) => void;
  onEdit?: (admin: UserManagementUser) => void; 
  onDelete?: (admin: UserManagementUser) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedAdminIds?: string[];
  setSelectedAdminIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const AdminGrid: React.FC<AdminGridProps> = ({
  admins,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  selectedAdminIds = [],
  setSelectedAdminIds
}) => {
  const handleSelectionChanged = (selectedRows: UserManagementUser[]) => {
    if (setSelectedAdminIds) {
      const ids = selectedRows.map(row => row.id);
      setSelectedAdminIds(ids);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedAdminIds.length > 0) {
      onBulkDelete(selectedAdminIds);
    }
  };

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
          <Shield className="h-4 w-4 text-music-500 mr-2" />
          {params.value}
        </div>
      )
    },
    {
      headerName: 'Email',
      field: 'email',
    },
    {
      headerName: 'Admin Level',
      field: 'adminLevel',
      valueFormatter: (params) => getAdminLevelName(params.value)
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

  return (
    <div className="space-y-4 w-full">
      {selectedAdminIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedAdminIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}
      
      <div className="w-full rounded-md border">
        <DataGrid
          rowData={admins}
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

export default AdminGrid;
