
import React from 'react';
import { format } from 'date-fns';
import { UserManagementUser } from '@/types/student';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, BadgeCheck, UserCog, UserPlus } from 'lucide-react';

interface UserTableProps {
  users: UserManagementUser[];
  isLoading: boolean;
  onViewUser: (user: UserManagementUser) => void;
  onDeleteUser: (user: UserManagementUser) => void;
}

const UserTable = ({ users, isLoading, onViewUser, onDeleteUser }: UserTableProps) => {
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading users...</div>;
  }
  
  if (users.length === 0) {
    return <div className="py-8 text-center text-gray-500">No users found.</div>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {`${user.firstName} ${user.lastName}`}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {user.role === 'admin' ? (
                  <BadgeCheck className="h-4 w-4 text-music-500 mr-1" />
                ) : user.role === 'teacher' ? (
                  <UserCog className="h-4 w-4 text-music-400 mr-1" />
                ) : (
                  <UserPlus className="h-4 w-4 text-music-300 mr-1" />
                )}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(user.createdAt), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewUser(user)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                {user.role !== 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
