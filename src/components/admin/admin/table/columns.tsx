
import { Shield } from 'lucide-react';
import { format } from 'date-fns';
import type { Column } from '@/components/ui/data-table/types';
import { UserManagementUser } from '@/types/student';

export const getAdminTableColumns = (): Column[] => [
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
