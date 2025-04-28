
import React from 'react';
import { format } from 'date-fns';
import { UserManagementUser } from '@/types/student';
import { Shield } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/data-table/DataTable';

interface AdminTableProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEditAdmin: (admin: UserManagementUser) => void;
  onDeleteAdmin: (admin: UserManagementUser) => void;
  onEditUserDetails?: (admin: UserManagementUser) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  isLoading,
  onEditAdmin,
  onDeleteAdmin,
  onEditUserDetails
}) => {
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
      render: (_, row) => (
        <div className="font-medium flex items-center">
          <Shield className="h-4 w-4 text-music-500 mr-2" />
          {`${row.firstName} ${row.lastName}`}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      filterable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      filterable: true,
      render: (value) => format(new Date(value), 'MMM d, yyyy')
    }
  ];

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

export default AdminTable;
