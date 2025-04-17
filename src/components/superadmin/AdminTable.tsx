import React, { useState } from 'react';
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
import { Pencil, Trash2, Shield, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminTableProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onEditAdmin: (admin: UserManagementUser) => void;
  onDeleteAdmin: (admin: UserManagementUser) => void;
  onEditUserDetails?: (admin: UserManagementUser) => void;
}

const AdminTable = ({ 
  admins, 
  isLoading, 
  onEditAdmin, 
  onDeleteAdmin,
  onEditUserDetails 
}: AdminTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAdmins = admins.filter(admin => 
    admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading administrators...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search administrators..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredAdmins.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {admins.length === 0 ? "No administrators found." : "No administrators match your search."}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium flex items-center">
                    <Shield className="h-4 w-4 text-music-500 mr-2" />
                    {`${admin.firstName} ${admin.lastName}`}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {format(new Date(admin.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {onEditUserDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUserDetails(admin)}
                          title="Edit user details"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Details</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditAdmin(admin)}
                        title="Edit admin role"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="sr-only">Edit Role</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
      <div className="text-sm text-muted-foreground pt-2">
        Showing {filteredAdmins.length} of {admins.length} administrators
      </div>
    </div>
  );
};

export default AdminTable;
