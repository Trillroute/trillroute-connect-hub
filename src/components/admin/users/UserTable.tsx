import React, { useState, useEffect } from 'react';
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
import { Eye, Trash2, BadgeCheck, UserCog, UserPlus, ArrowUpDown, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserTableProps {
  users: UserManagementUser[];
  isLoading: boolean;
  onViewUser: (user: UserManagementUser) => void;
  onDeleteUser: (user: UserManagementUser) => void;
  canDeleteUser?: (user: UserManagementUser) => boolean;
}

type SortField = 'name' | 'email' | 'role' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const UserTable = ({ 
  users: initialUsers, 
  isLoading, 
  onViewUser, 
  onDeleteUser,
  canDeleteUser = () => true
}: UserTableProps) => {
  const [users, setUsers] = useState<UserManagementUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    let filteredUsers = [...initialUsers];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user => 
          user.firstName.toLowerCase().includes(query) || 
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }
    
    filteredUsers.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setUsers(filteredUsers);
  }, [initialUsers, searchQuery, sortField, sortDirection, roleFilter]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setSortField('name');
    setSortDirection('asc');
  };
  
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading users...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" /> 
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className={sortField === 'name' ? 'bg-accent' : ''}
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'email' ? 'bg-accent' : ''}
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'role' ? 'bg-accent' : ''}
                onClick={() => handleSort('role')}
              >
                Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'createdAt' ? 'bg-accent' : ''}
                onClick={() => handleSort('createdAt')}
              >
                Created Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-muted/40 rounded-md border">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-sm font-medium mb-1">Filter by Role</p>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="self-end mb-0.5"
            >
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>
        </div>
      )}
      
      {users.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {initialUsers.length === 0 ? "No users found." : "No users match your filters."}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (
                  <ArrowUpDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (
                  <ArrowUpDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('role')}
              >
                Role {sortField === 'role' && (
                  <ArrowUpDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('createdAt')}
              >
                Created {sortField === 'createdAt' && (
                  <ArrowUpDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
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
                    ) : user.role === 'superadmin' ? (
                      <BadgeCheck className="h-4 w-4 text-music-700 mr-1" />
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
                    {canDeleteUser(user) && (
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
      )}
      <div className="text-sm text-muted-foreground pt-2">
        Showing {users.length} of {initialUsers.length} users
      </div>
    </div>
  );
};

export default UserTable;
