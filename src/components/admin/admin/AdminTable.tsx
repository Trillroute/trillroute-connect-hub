
import React from 'react';
import { UserManagementUser } from '@/types/student';
import AdminTableView from './table/AdminTableView';

interface AdminTableProps {
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

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  isLoading,
  onEdit,
  onDelete,
  onView,
  viewMode,
  selectedIds,
  setSelectedIds,
  canEdit,
  canDelete
}) => {
  return (
    <AdminTableView 
      admins={admins} 
      isLoading={isLoading} 
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      viewMode={viewMode}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
};

export default AdminTable;
