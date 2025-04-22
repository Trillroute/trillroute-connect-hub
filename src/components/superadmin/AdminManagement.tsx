import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Pencil, Trash2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { fetchAdmins, updateUserRole, deleteUser } from './AdminService';
import { updateUser } from '../admin/users/UserServiceExtended';
import { updateAdminLevel } from './AdminRoleService';
import AdminTable from './AdminTable';
import DeleteAdminDialog from './DeleteAdminDialog';
import EditUserDialog from '../admin/users/EditUserDialog';
import { useAuth } from '@/hooks/useAuth';

const AdminManagement = () => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserManagementUser | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const adminsData = await fetchAdmins();
      setAdmins(adminsData);
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

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'teacher') => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, newRole);

      toast({
        title: 'Success',
        description: `User role updated to ${newRole}.`,
      });
      
      setIsRoleDialogOpen(false);
      setAdminToEdit(null);
      loadAdmins();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserDetails = async (userId: string, userData: Partial<UserManagementUser>) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Administrator details updated successfully.',
      });
      
      loadAdmins();
    } catch (error: any) {
      console.error('Error updating admin details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdminLevel = async (userId: string, newLevelName: string) => {
    try {
      setIsLoading(true);
      console.log(`[SuperadminAdminManagement] Updating admin level for ${userId} to ${newLevelName}`);
      await updateAdminLevel(userId, newLevelName);

      toast({
        title: 'Success',
        description: 'Administrator permission level updated successfully.',
      });
      
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

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(adminToDelete.id);

      toast({
        title: 'Success',
        description: `Administrator removed successfully.`,
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

  const openEditUserDialog = (admin: UserManagementUser) => {
    setUserToEdit(admin);
    setIsEditUserDialogOpen(true);
  };

  const openDeleteDialog = (admin: UserManagementUser) => {
    setAdminToDelete(admin);
    setIsDeleteDialogOpen(true);
  };

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-8">
          <h3 className="text-lg font-medium">Permission Denied</h3>
          <p className="text-gray-500">You don't have permission to manage administrators.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Administrator Management</CardTitle>
            <CardDescription>Manage administrator accounts and permissions</CardDescription>
          </div>
          <div className="flex space-x-2 items-center">
            <Button 
              size="sm" 
              variant={viewMode === 'list' ? "secondary" : "outline"}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'grid' ? "secondary" : "outline"}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'tile' ? "secondary" : "outline"}
              onClick={() => setViewMode('tile')}
              title="Tile view"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={loadAdmins}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'list' && (
          <AdminTable 
            admins={admins} 
            isLoading={isLoading}
            onEditAdmin={() => {}} // This is no longer used
            onDeleteAdmin={openDeleteDialog}
            onEditUserDetails={openEditUserDialog}
          />
        )}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admins.map(admin => (
              <div key={admin.id} className="bg-muted rounded-lg shadow-sm p-4 flex flex-col">
                <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
                <div className="text-sm text-gray-500">{admin.email}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditUserDialog(admin)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(admin)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === 'tile' && (
          <div className="flex flex-wrap gap-4">
            {admins.map(admin => (
              <div key={admin.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
                <Shield className="h-8 w-8 text-music-500 mb-2" />
                <div className="font-semibold">{admin.firstName} {admin.lastName}</div>
                <div className="text-xs text-gray-500">{admin.email}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditUserDialog(admin)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(admin)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DeleteAdminDialog
          admin={adminToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteAdmin}
          isLoading={isLoading}
        />

        <EditUserDialog
          user={userToEdit}
          isOpen={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onUpdateUser={handleUpdateUserDetails}
          onUpdateLevel={handleUpdateAdminLevel}
          isLoading={isLoading}
          userRole="Administrator"
          showAdminLevelSelector={true}
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
