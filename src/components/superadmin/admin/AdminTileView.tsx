
import React from 'react';
import { UserManagementUser } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shield } from 'lucide-react';

interface AdminTileViewProps {
  admins: UserManagementUser[];
  onEdit: (admin: UserManagementUser) => void;
  onDelete: (admin: UserManagementUser) => void;
}

const AdminTileView: React.FC<AdminTileViewProps> = ({ admins, onEdit, onDelete }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {admins.map(admin => (
        <div key={admin.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
          <Shield className="h-8 w-8 text-music-500 mb-2" />
          <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
          <div className="text-xs text-gray-500">{admin.email}</div>
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

export default AdminTileView;
