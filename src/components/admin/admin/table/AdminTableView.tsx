
import React from 'react';
import { UserManagementUser } from '@/types/student';
import DataTable from '@/components/ui/data-table';
import { getAdminTableColumns } from './columns';
import type { Column } from '@/components/ui/data-table/types';

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
  setSelectedIds
}) => {
  const columns = getAdminTableColumns();

  return (
    <DataTable
      data={admins}
      columns={columns}
      loading={isLoading}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );
};

export default AdminTableView;
