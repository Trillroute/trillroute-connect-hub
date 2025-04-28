
import React from 'react';
import { UserManagementUser } from '@/types/student';
import AdminTableView from './table/AdminTableView';

interface AdminTableProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEditAdmin: (admin: UserManagementUser) => void;
  onDeleteAdmin: (admin: UserManagementUser) => void;
  onEditUserDetails?: (admin: UserManagementUser) => void;
}

const AdminTable: React.FC<AdminTableProps> = (props) => {
  return <AdminTableView {...props} />;
};

export default AdminTable;
