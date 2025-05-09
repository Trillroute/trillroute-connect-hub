import { useState, useEffect } from 'react';
import { UserManagementUser } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { fetchAdmins, updateUserRole, deleteUser } from '@/components/superadmin/AdminService';
import { updateUser } from '@/components/admin/users/UserServiceExtended';
import { updateAdminRole } from '@/components/superadmin/AdminRoleService';

type ViewMode = 'list' | 'grid' | 'tile';

export const useAdminManagement = () => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserManagementUser | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
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
      
      // Update the user's admin level in the database
      const { error } = await supabase
        .from('custom_users')
        .update({ admin_level_name: newLevelName })
        .eq('id', userId);

      if (error) {
        throw error;
      }

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

  return {
    admins,
    isLoading,
    viewMode,
    setViewMode,
    isRoleDialogOpen,
    setIsRoleDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    adminToEdit,
    setAdminToEdit,
    adminToDelete,
    userToEdit,
    loadAdmins,
    handleUpdateRole,
    handleUpdateUserDetails,
    handleUpdateAdminLevel,
    handleDeleteAdmin,
    openEditUserDialog,
    openDeleteDialog
  };
};

export type { ViewMode };
