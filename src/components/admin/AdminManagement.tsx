
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
import { fetchAllAdmins, addUser, deleteUser } from './users/UserService';
import { useAuth } from '@/hooks/useAuth';
import { useAdminPermissions } from './hooks/admin/useAdminPermissions';
import { useAdminLevelManagement } from './hooks/admin/useAdminLevelManagement';

interface AdminManagementProps {
  canAddAdmin?: boolean;
  canEditAdmin?: boolean;
  canDeleteAdmin?: boolean;
  canEditAdminLevel?: boolean;
}

const AdminManagement = ({
  canAddAdmin = true,
  canEditAdmin = true,
  canDeleteAdmin = true,
  canEditAdminLevel = true,
}: AdminManagementProps) => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditAdminLevelDialogOpen, setIsEditAdminLevelDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [adminToView, setAdminToView] = useState<UserManagementUser | null>(null);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();
  const { isAdmin, isSuperAdmin } = useAuth();
  
  const { 
    effectiveCanEditAdminLevel,
    isAdminEditable,
    canAdminBeDeleted
  } = useAdminPermissions(canEditAdmin, canDeleteAdmin, canEditAdminLevel);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const adminsData = await fetchAllAdmins();
      setAdmins(adminsData.filter(user => user.role === 'admin'));
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

  const { handleUpdateAdminLevel, isUpdatingLevel } = useAdminLevelManagement(loadAdmins);

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
      
      setIsLoading(true);
      const adminData = {
        ...userData,
        role: 'admin'
      };
      
      await addUser(adminData);

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

  const handleDeleteFromView = () => {
    if (adminToView) {
      setAdminToDelete(adminToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Administrator Management</CardTitle>
            <CardDescription>Manage administrator accounts and permissions</CardDescription>
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
          onDeleteUser={openDeleteDialog}
          onEditAdminLevel={openEditAdminLevelDialog}
          canDeleteUser={canAdminBeDeleted}
          canEditAdminLevel={effectiveCanEditAdminLevel}
          userRole="admin"
        />
        
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddAdmin}
          isLoading={isLoading}
          allowAdminCreation={true}
          defaultRole="admin"
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
          onDeleteUser={handleDeleteFromView}
          canDeleteUser={adminToView ? canAdminBeDeleted(adminToView) : false}
        />

        <EditAdminLevelDialog
          admin={adminToEdit}
          isOpen={isEditAdminLevelDialogOpen}
          onOpenChange={setIsEditAdminLevelDialogOpen}
          onUpdateLevel={handleUpdateAdminLevel}
          isLoading={isUpdatingLevel}
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
