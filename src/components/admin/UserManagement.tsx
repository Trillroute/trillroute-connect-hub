import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import UserTable from './users/UserTable';
import AddUserDialog, { NewUserData } from './users/AddUserDialog';
import DeleteUserDialog from './users/DeleteUserDialog';
import ViewUserDialog from './users/ViewUserDialog';
import EditAdminLevelDialog from './users/EditAdminLevelDialog';
import { fetchAllUsers, addUser, deleteUser, updateAdminLevel } from './users/UserService';
import { useAuth } from '@/hooks/useAuth';

interface UserManagementProps {
  allowAdminCreation?: boolean;
  canAddUser?: boolean;
  canDeleteUser?: boolean;
}

const UserManagement = ({ 
  allowAdminCreation = false,
  canAddUser = true,
  canDeleteUser = true 
}: UserManagementProps) => {
  const [users, setUsers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditAdminLevelDialogOpen, setIsEditAdminLevelDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserManagementUser | null>(null);
  const [userToView, setUserToView] = useState<UserManagementUser | null>(null);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (userData: NewUserData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} added successfully.`,
      });
      
      setIsAddDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(userToDelete.id);

      toast({
        title: 'Success',
        description: `${userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1)} removed successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdminLevel = async (userId: string, newLevelName: string) => {
    try {
      setIsLoading(true);
      await updateAdminLevel(userId, newLevelName);

      toast({
        title: 'Success',
        description: `Admin permission level updated successfully.`,
      });
      
      setIsEditAdminLevelDialogOpen(false);
      setAdminToEdit(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error updating admin level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update permission level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openViewDialog = (user: UserManagementUser) => {
    setUserToView(user);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (user: UserManagementUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFromView = () => {
    if (userToView) {
      setUserToDelete(userToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  const canUserBeDeleted = (user: UserManagementUser) => {
    if (!canDeleteUser) return false;
    
    if (isSuperAdmin()) {
      return true;
    } else if (isAdmin()) {
      return user.role !== 'admin' && user.role !== 'superadmin';
    }
    return false;
  };

  const canEditAdminLevel = (user: UserManagementUser) => {
    return isSuperAdmin() && user.role === 'admin';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage students and teachers</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {canAddUser && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={users} 
          isLoading={isLoading}
          onViewUser={openViewDialog}
          onDeleteUser={openDeleteDialog}
          onEditAdminLevel={openEditAdminLevelDialog}
          canDeleteUser={canUserBeDeleted}
          canEditAdminLevel={canEditAdminLevel}
        />
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddUser}
          isLoading={isLoading}
          allowAdminCreation={allowAdminCreation || isSuperAdmin()}
        />
        
        <DeleteUserDialog
          user={userToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />
        
        <ViewUserDialog
          user={userToView}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onDeleteUser={handleDeleteFromView}
          canDeleteUser={userToView ? canUserBeDeleted(userToView) : false}
        />

        <EditAdminLevelDialog
          admin={adminToEdit}
          isOpen={isEditAdminLevelDialogOpen}
          onOpenChange={setIsEditAdminLevelDialogOpen}
          onUpdateLevel={handleUpdateAdminLevel}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
