
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
import { Eye, Trash2, BadgeCheck, UserCog, UserPlus, ArrowUpDown, Search, Filter, X, ShieldAlert, Pencil } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_ADMIN_LEVELS } from './EditAdminLevelDialog';

interface UserTableProps {
  users: UserManagementUser[];
  isLoading: boolean;
  onViewUser: (user: UserManagementUser) => void;
  onDeleteUser: (user: UserManagementUser) => void;
  onEditUser?: (user: UserManagementUser) => void;
  onEditAdminLevel?: (user: UserManagementUser) => void;
  canDeleteUser?: (user: UserManagementUser) => boolean;
  canEditAdminLevel?: (user: UserManagementUser) => boolean;
  canEditUser?: (user: UserManagementUser) => boolean;
  roleFilter?: string;
  viewMode?: 'list' | 'grid' | 'tile';
  selectedUserIds?: string[];
  onSelectUserId?: (userId: string) => void;
  onSelectAll?: (userIds: string[]) => void;
}

type SortField = 'name' | 'email' | 'role' | 'createdAt' | 'adminLevel';
type SortDirection = 'asc' | 'desc';

const UserTable = ({ 
  users: initialUsers, 
  isLoading, 
  onViewUser, 
  onDeleteUser,
  onEditUser,
  onEditAdminLevel,
  canDeleteUser = () => true,
  canEditAdminLevel = () => false,
  canEditUser = () => false,
  roleFilter,
  viewMode = 'list',
  selectedUserIds = [],
  onSelectUserId,
  onSelectAll
}: UserTableProps) => {
  const [users, setUsers] = useState<UserManagementUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>(roleFilter || 'all');
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
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    } else if (selectedRoleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === selectedRoleFilter);
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
        case 'adminLevel':
          comparison = (a.adminLevel || 0) - (b.adminLevel || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setUsers(filteredUsers);
  }, [initialUsers, searchQuery, sortField, sortDirection, selectedRoleFilter, roleFilter]);

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
    if (!roleFilter) {
      setSelectedRoleFilter('all');
    }
    setSortField('name');
    setSortDirection('asc');
  };

  const getAdminLevelName = (level?: number) => {
    if (level === undefined) return '';
    switch (level) {
      case 0: return 'Level 0 (Super Admin)';
      case 1: return 'Level 1';
      case 2: return 'Level 2';
      case 3: return 'Level 3';
      case 4: return 'Level 4';
      case 5: return 'Level 5';
      case 6: return 'Level 6';
      case 8: return 'Level 8';
      default: return `Level ${level}`;
    }
  };

  const allUserIds = users.map(u => u.id);

  // Checkbox logic
  const allSelected = selectedUserIds.length > 0 && allUserIds.length > 0
    && allUserIds.every(id => selectedUserIds.includes(id));
  const someSelected = selectedUserIds.length > 0 && !allSelected;

  // --- Render LIST view ---
  if (viewMode === 'list') {
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
            {!roleFilter && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" /> 
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            )}
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
                  Name {sortField === 'name' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={sortField === 'email' ? 'bg-accent' : ''}
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </DropdownMenuItem>
                {!roleFilter && (
                  <DropdownMenuItem
                    className={sortField === 'role' ? 'bg-accent' : ''}
                    onClick={() => handleSort('role')}
                  >
                    Role {sortField === 'role' && (
                      <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className={sortField === 'createdAt' ? 'bg-accent' : ''}
                  onClick={() => handleSort('createdAt')}
                >
                  Created Date {sortField === 'createdAt' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </DropdownMenuItem>
                {(roleFilter === 'admin' || selectedRoleFilter === 'admin') && (
                  <DropdownMenuItem
                    className={sortField === 'adminLevel' ? 'bg-accent' : ''}
                    onClick={() => handleSort('adminLevel')}
                  >
                    Admin Level {sortField === 'adminLevel' && (
                      <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {showFilters && !roleFilter && (
          <div className="p-4 bg-muted/40 rounded-md border">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <p className="text-sm font-medium mb-1">Filter by Role</p>
                <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
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
                <TableHead className="w-6 py-3">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => {
                        if (allSelected) {
                          onSelectAll?.([]);
                        } else {
                          onSelectAll?.(allUserIds);
                        }
                      }}
                      aria-label="Select all users"
                    />
                  </div>
                </TableHead>
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
                {!roleFilter && (
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleSort('role')}
                  >
                    Role {sortField === 'role' && (
                      <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    )}
                  </TableHead>
                )}
                {(roleFilter === 'admin' || selectedRoleFilter === 'admin') && (
                  <TableHead>
                    Admin Level
                  </TableHead>
                )}
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
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={e => {
                    const isActionButton = (e.target as HTMLElement).closest('button');
                    if (!isActionButton) {
                      onViewUser(user);
                    }
                  }}
                >
                  <TableCell className="w-6 align-middle">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => onSelectUserId?.(user.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${user.firstName} ${user.lastName}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[160px] truncate" title={`${user.firstName} ${user.lastName}`}>
                    {`${user.firstName} ${user.lastName}`}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate" title={user.email}>
                    {user.email}
                  </TableCell>
                  {!roleFilter && (
                    <TableCell>
                      <div className="flex items-center">
                        {user.role === 'superadmin' ? (
                          <BadgeCheck className="h-4 w-4 text-music-500 mr-1" />
                        ) : user.role === 'teacher' ? (
                          <UserCog className="h-4 w-4 text-music-400 mr-1" />
                        ) : user.role === 'superadmin' ? (
                          <ShieldAlert className="h-4 w-4 text-music-700 mr-1" />
                        ) : (
                          <UserPlus className="h-4 w-4 text-music-300 mr-1" />
                        )}
                        {user.role === 'superadmin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </TableCell>
                  )}
                  {(roleFilter === 'admin' || selectedRoleFilter === 'admin') && (
                    <TableCell>
                      {getAdminLevelName(user.adminLevel)}
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    
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
  }

  // --- Render GRID view ---
  if (viewMode === "grid") {
    if (isLoading) {
      return <div className="py-8 text-center text-gray-500">Loading users...</div>;
    }
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <div
              key={user.id}
              className={`bg-muted rounded-lg shadow-sm p-4 flex flex-col border relative cursor-pointer hover:bg-muted/70`}
              onClick={e => {
                const isActionButton = (e.target as HTMLElement).closest('button');
                const isCheckbox = (e.target as HTMLElement).closest('input[type="checkbox"]');
                if (!isActionButton && !isCheckbox) onViewUser(user);
              }}
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onCheckedChange={() => onSelectUserId?.(user.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="text-xs text-gray-400 mt-1">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Created: {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {users.length} of {initialUsers.length} users
        </div>
      </div>
    );
  }

  // --- Render TILE view ---
  if (viewMode === "tile") {
    if (isLoading) {
      return <div className="py-8 text-center text-gray-500">Loading users...</div>;
    }
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
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
        </div>
        <div className="flex flex-wrap gap-4">
          {users.map(user => (
            <div
              key={user.id}
              className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center border group relative cursor-pointer hover:bg-muted/70"
              onClick={e => {
                const isActionButton = (e.target as HTMLElement).closest('button');
                const isCheckbox = (e.target as HTMLElement).closest('input[type="checkbox"]');
                if (!isActionButton && !isCheckbox) onViewUser(user);
              }}
            >
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onCheckedChange={() => onSelectUserId?.(user.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-music-100 rounded-full mb-2">
                <UserPlus className="h-6 w-6 text-music-400" />
              </div>
              <div className="font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="mt-1 text-xs text-gray-400">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Created: {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground pt-2 mt-2">
          Showing {users.length} of {initialUsers.length} users
        </div>
      </div>
    );
  }

  // Default fallback for future view types etc
  return null;
};

export default UserTable;

// NOTE: This file is getting long; consider splitting up views/components.
