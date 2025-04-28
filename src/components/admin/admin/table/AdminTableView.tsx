
import React from 'react';
import { UserManagementUser } from '@/types/student';
import DataTable from '@/components/ui/data-table';
import { getAdminTableColumns } from './columns';

interface AdminTableViewProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEditAdmin: (admin: UserManagementUser) => void;
  onDeleteAdmin: (admin: UserManagementUser) => void;
  onEditUserDetails?: (admin: UserManagementUser) => void;
}

const AdminTableView: React.FC<AdminTableViewProps> = ({
  admins,
  isLoading,
  onEditAdmin,
  onDeleteAdmin,
  onEditUserDetails
}) => {
  const columns = getAdminTableColumns();

  return (
    <DataTable
      data={admins}
      columns={columns}
      loading={isLoading}
      onView={onEditUserDetails}
      onEdit={onEditAdmin}
      onDelete={onDeleteAdmin}
    />
  );
};

export default AdminTableView;
