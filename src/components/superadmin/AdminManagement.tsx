
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
import { fetchAdmins, updateUserRole, deleteUser } from './AdminService';
import AdminTable from './AdminTable';
import EditAdminDialog from './EditAdminDialog';
import DeleteAdminDialog from './DeleteAdminDialog';

const AdminManagement = () => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();

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
      
      setIsEditDialogOpen(false);
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

  const openEditDialog = (admin: UserManagementUser) => {
    setAdminToEdit(admin);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (admin: UserManagementUser) => {
    setAdminToDelete(admin);
    setIsDeleteDialogOpen(true);
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AdminTable 
          admins={admins} 
          isLoading={isLoading}
          onEditAdmin={openEditDialog}
          onDeleteAdmin={openDeleteDialog}
        />
        
        <EditAdminDialog
          admin={adminToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateRole={handleUpdateRole}
          isLoading={isLoading}
        />
        
        <DeleteAdminDialog
          admin={adminToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteAdmin}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
