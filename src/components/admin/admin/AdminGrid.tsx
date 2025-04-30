
import React, { useMemo } from 'react';
import { UserManagementUser } from '@/types/student';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';
import UnifiedDataGrid, { ColumnConfig } from '@/components/common/table/UnifiedDataGrid';

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

  const columnConfigs = useMemo<ColumnConfig[]>(() => [
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: ({ data }) => `${data.firstName} ${data.lastName}`,
      cellRenderer: ({ value }) => (
        <div className="font-medium flex items-center">
          <Shield className="h-4 w-4 text-music-500 mr-2" />
          {value}
        </div>
      )
    },
    {
      field: 'email',
      headerName: 'Email'
    },
    {
      field: 'adminLevel',
      headerName: 'Admin Level',
      valueFormatter: ({ value }) => getAdminLevelName(value)
    },
    {
      field: 'createdAt',
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
      data={admins}
      columnConfigs={columnConfigs}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedAdminIds}
      setSelectedIds={setSelectedAdminIds}
      emptyMessage="No administrators found"
    />
  );
};

export default AdminGrid;
