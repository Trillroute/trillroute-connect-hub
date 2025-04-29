
import React from 'react';
import { UserManagementUser } from '@/types/student';
import DataTable from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table/types';
import { getAdminTableColumns } from './columns';
import AdminGrid from '@/components/admin/admin/AdminGrid';

interface AdminTableViewProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEdit?: (admin: UserManagementUser) => void;
  onDelete?: (admin: UserManagementUser) => void;
  onView?: (admin: UserManagementUser) => void;
  viewMode?: string;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  canEdit?: (admin: UserManagementUser) => boolean; 
  canDelete?: (admin: UserManagementUser) => boolean;
}

const AdminTableView: React.FC<AdminTableViewProps> = ({
  admins,
  isLoading,
  onEdit,
  onDelete,
  onView,
  selectedIds,
  setSelectedIds,
}) => {
  // Always use our custom DataGrid via AdminGrid
  return (
    <AdminGrid
      admins={admins}
      isLoading={isLoading}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={setSelectedIds ? (ids) => setSelectedIds([]) : undefined}
      selectedAdminIds={selectedIds}
      setSelectedAdminIds={setSelectedIds}
    />
  );
};

export default AdminTableView;
