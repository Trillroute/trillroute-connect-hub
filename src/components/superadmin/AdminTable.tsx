
import React from 'react';
import { UserManagementUser } from '@/types/student';
import DataTable from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table/types';
import { Shield } from 'lucide-react';
import { format } from 'date-fns';

interface AdminTableProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEdit?: (admin: UserManagementUser) => void;
  onDelete?: (admin: UserManagementUser) => void;
  onView?: (admin: UserManagementUser) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  isLoading,
  onEdit,
  onDelete,
  onView
}) => {
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
      render: (_, row: UserManagementUser) => (
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
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default AdminTable;
