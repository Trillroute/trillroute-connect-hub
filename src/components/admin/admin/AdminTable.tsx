
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
import { PenSquare, Trash2, Eye, Search, Grid2x2, LayoutGrid, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";

interface AdminTableProps {
  admins: UserManagementUser[];
  isLoading: boolean;
  onViewAdmin: (admin: UserManagementUser) => void;
  onEditAdmin: (admin: UserManagementUser) => void;
  onDeleteAdmin: (admin: UserManagementUser) => void;
  canDeleteAdmin: (admin: UserManagementUser) => boolean;
  canEditAdmin: (admin: UserManagementUser) => boolean;
  viewMode?: 'list' | 'grid' | 'tile';
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const AdminTable = ({
  admins,
  isLoading,
  onViewAdmin,
  onEditAdmin,
  onDeleteAdmin,
  canDeleteAdmin,
  canEditAdmin,
  viewMode = 'list',
  selectedIds = [],
  setSelectedIds = () => {},
}: AdminTableProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredAdmins = admins.filter(admin =>
    admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allAdminIds = filteredAdmins.map(a => a.id);
  const allSelected = selectedIds.length > 0 && allAdminIds.length > 0 && allAdminIds.every(id => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  // List view
  if (viewMode === 'list') {
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
                  <TableHead className="w-6 py-3">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onCheckedChange={() => {
                          if (allSelected) setSelectedIds([]);
                          else setSelectedIds(allAdminIds);
                        }}
                        aria-label="Select all"
                      />
                    </div>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin Level</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(admin.id)}
                        onCheckedChange={() => {
                          if (selectedIds.includes(admin.id)) {
                            setSelectedIds(selectedIds.filter(id => id !== admin.id));
                          } else {
                            setSelectedIds([...selectedIds, admin.id]);
                          }
                        }}
                        aria-label={`Select ${admin.firstName} ${admin.lastName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {`${admin.firstName} ${admin.lastName}`}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.adminRoleName || "Limited View"}</TableCell>
                    <TableCell>
                      {format(new Date(admin.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewAdmin(admin)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        {canEditAdmin(admin) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditAdmin(admin)}
                          >
                            <PenSquare className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {canDeleteAdmin(admin) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteAdmin(admin)}
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
          </ScrollArea>
        )}
        <div className="text-sm text-muted-foreground pt-2">
          Showing {filteredAdmins.length} of {admins.length} administrators
        </div>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div>
        <div className="flex mb-2">
          <Input
            type="search"
            placeholder="Search administrators..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAdmins.map(admin => (
            <div
              key={admin.id}
              className="bg-muted rounded-lg shadow-sm p-4 flex flex-col border relative"
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedIds.includes(admin.id)}
                  onCheckedChange={() => {
                    if (selectedIds.includes(admin.id)) {
                      setSelectedIds(selectedIds.filter(id => id !== admin.id));
                    } else {
                      setSelectedIds([...selectedIds, admin.id]);
                    }
                  }}
                  aria-label={`Select ${admin.firstName} ${admin.lastName}`}
                />
              </div>
              <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
              <div className="text-sm text-gray-500">{admin.email}</div>
              <div className="text-xs text-gray-400 mt-1">
                Level: {admin.adminRoleName || "Limited View"}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Created: {format(new Date(admin.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewAdmin(admin)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {canEditAdmin(admin) && (
                  <Button variant="ghost" size="sm" onClick={() => onEditAdmin(admin)}>
                    <PenSquare className="h-4 w-4" />
                  </Button>
                )}
                {canDeleteAdmin(admin) && (
                  <Button variant="ghost" size="sm" onClick={() => onDeleteAdmin(admin)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {filteredAdmins.length} of {admins.length} administrators
        </div>
      </div>
    );
  }

  // Tile view
  if (viewMode === 'tile') {
    return (
      <div>
        <div className="flex mb-2">
          <Input
            type="search"
            placeholder="Search administrators..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          {filteredAdmins.map(admin => (
            <div
              key={admin.id}
              className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center border relative"
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedIds.includes(admin.id)}
                  onCheckedChange={() => {
                    if (selectedIds.includes(admin.id)) {
                      setSelectedIds(selectedIds.filter(id => id !== admin.id));
                    } else {
                      setSelectedIds([...selectedIds, admin.id]);
                    }
                  }}
                  aria-label={`Select ${admin.firstName} ${admin.lastName}`}
                />
              </div>
              <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
              <div className="text-xs text-gray-500">{admin.email}</div>
              <div className="mt-1 text-xs text-gray-400">
                Level: {admin.adminRoleName || "Limited View"}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Created: {format(new Date(admin.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewAdmin(admin)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {canEditAdmin(admin) && (
                  <Button variant="ghost" size="sm" onClick={() => onEditAdmin(admin)}>
                    <PenSquare className="h-4 w-4" />
                  </Button>
                )}
                {canDeleteAdmin(admin) && (
                  <Button variant="ghost" size="sm" onClick={() => onDeleteAdmin(admin)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {filteredAdmins.length} of {admins.length} administrators
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
};

export default AdminTable;
