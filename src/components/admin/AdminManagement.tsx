import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import UserTable from './users/UserTable';
import AddUserDialog, { NewUserData } from './users/AddUserDialog';
import DeleteUserDialog from './users/DeleteUserDialog';
import ViewUserDialog from './users/ViewUserDialog';
import EditUserDialog from './users/EditUserDialog';
import EditAdminLevelDialog from './users/EditAdminLevelDialog';
import { fetchAllUsers, addUser, deleteUser, updateAdminLevel } from './users/UserService';
import { updateUser } from './users/UserServiceExtended';
import { useAuth } from '@/hooks/useAuth';

interface AdminManagementProps {
  canAddAdmin?: boolean;
  canEditAdmin?: boolean;
  canDeleteAdmin?: boolean;
  canEditAdminLevel?: boolean;
}

const AdminManagement = ({ 
  canAddAdmin = false,
  canEditAdmin = false,
  canDeleteAdmin = false,
  canEditAdminLevel = false
}: AdminManagementProps) => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditAdminLevelDialogOpen, setIsEditAdminLevelDialogOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [adminToView, setAdminToView] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setAdmins(usersData.filter(user => user.role === 'admin'));
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch administrators. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (userData: NewUserData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      userData.role = 'admin';
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: 'Administrator added successfully.',
      });
      
      setIsAddDialogOpen(false);
      loadAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add administrator. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdmin = async (userId: string, userData: Partial<UserManagementUser>) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Administrator updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      setAdminToEdit(null);
      loadAdmins();
    } catch (error: any) {
      console.error('Error updating admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(adminToDelete.id);

      toast({
        title: 'Success',
        description: 'Administrator removed successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setAdminToDelete(null);
      loadAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete administrator. Please try again.',
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
        description: 'Admin permission level updated successfully.',
      });
      
      setIsEditAdminLevelDialogOpen(false);
      setAdminToEdit(null);
      loadAdmins();
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

  const openEditDialog = (admin: UserManagementUser) => {
    if (!canEditAdmin) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit administrators.",
        variant: "destructive",
      });
      return;
    }
    setAdminToEdit(admin);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (admin: UserManagementUser) => {
    setAdminToView(admin);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (admin: UserManagementUser) => {
    setAdminToDelete(admin);
    setIsDeleteDialogOpen(true);
  };

  const openEditAdminLevelDialog = (admin: UserManagementUser) => {
    setAdminToEdit(admin);
    setIsEditAdminLevelDialogOpen(true);
  };

  const canAdminBeDeleted = (admin: UserManagementUser) => {
    return canDeleteAdmin;
  };

  const canEditLevel = (admin: UserManagementUser) => {
    return canEditAdminLevel;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Administrator Management</CardTitle>
            <CardDescription>Manage administrator accounts</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadAdmins}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {canAddAdmin && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Administrator
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={admins} 
          isLoading={isLoading}
          onViewUser={openViewDialog}
          onEditUser={canEditAdmin ? openEditDialog : undefined}
          onDeleteUser={openDeleteDialog}
          onEditAdminLevel={openEditAdminLevelDialog}
          canDeleteUser={canAdminBeDeleted}
          canEditUser={canEditAdmin ? () => true : undefined}
          canEditAdminLevel={canEditLevel}
          roleFilter="admin"
        />
        
        {canAddAdmin && (
          <AddUserDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddUser={handleAddAdmin}
            isLoading={isLoading}
            allowAdminCreation={true}
            defaultRole="admin"
            title="Add Administrator"
          />
        )}
        
        <EditUserDialog
          user={adminToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateUser={handleUpdateAdmin}
          isLoading={isLoading}
          userRole="Administrator"
        />
        
        <DeleteUserDialog
          user={adminToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteAdmin}
          isLoading={isLoading}
          userRole="Administrator"
        />
        
        <ViewUserDialog
          user={adminToView}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
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

export default AdminManagement;
