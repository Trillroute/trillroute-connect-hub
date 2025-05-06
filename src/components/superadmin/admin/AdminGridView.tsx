
import React from 'react';
import { UserManagementUser } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shield } from 'lucide-react';

interface AdminGridViewProps {
  admins: UserManagementUser[];
  onEdit: (admin: UserManagementUser) => void;
  onDelete: (admin: UserManagementUser) => void;
}

const AdminGridView: React.FC<AdminGridViewProps> = ({ admins, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {admins.map(admin => (
        <div key={admin.id} className="bg-muted rounded-lg shadow-sm p-4 flex flex-col">
          <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
          <div className="text-sm text-gray-500">{admin.email}</div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(admin)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(admin)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminGridView;
