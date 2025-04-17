
import { useState, useCallback } from 'react';
import { UserManagementUser } from '@/types/student';
import { NewUserData } from '../users/AddUserDialog';
import { fetchAllUsers, addUser, deleteUser, updateAdminLevel } from '../users/UserService';
import { updateUser } from '../users/UserServiceExtended';
import { useAuth } from '@/hooks/useAuth';

type UseAdminManagementProps = {
  canEditAdmin: boolean;
  canDeleteAdmin: boolean;
  canEditAdminLevel: boolean;
  toast: any;
};

export const useAdminManagement = ({ 
  canEditAdmin, 
  canDeleteAdmin,
  canEditAdminLevel,
  toast 
}: UseAdminManagementProps) => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [adminToView, setAdminToView] = useState<UserManagementUser | null>(null);
  const { isSuperAdmin } = useAuth();
  
  // Override permissions for superadmin
  const effectiveCanEditAdminLevel = isSuperAdmin() ? true : canEditAdminLevel;

  const loadAdmins = useCallback(async () => {
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
  }, [toast]);

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
      
      loadAdmins();
      return true;
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add administrator. Please try again.',
        variant: 'destructive',
      });
      return false;
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
      return true;
    } catch (error: any) {
      console.error('Error updating admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update administrator. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return false;
    
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
      return true;
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete administrator. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdminLevel = async (userId: string, newLevelName: string) => {
    try {
      setIsLoading(true);
      console.log(`[AdminManagement] Updating admin level for ${userId} to ${newLevelName}`);
      await updateAdminLevel(userId, newLevelName);

      toast({
        title: 'Success',
        description: 'Admin permission level updated successfully.',
      });
      
      loadAdmins();
      return true;
    } catch (error: any) {
      console.error('Error updating admin level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update permission level. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (admin: UserManagementUser) => {
    if (!canEditAdmin && !isSuperAdmin()) {
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
    if (!canDeleteAdmin && !isSuperAdmin()) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete administrators.",
        variant: "destructive",
      });
      return;
    }
    setAdminToDelete(admin);
    setIsDeleteDialogOpen(true);
  };

  const canAdminBeDeleted = (admin: UserManagementUser) => {
    return isSuperAdmin() || canDeleteAdmin;
  };

  const isAdminEditable = (admin: UserManagementUser) => {
    return isSuperAdmin() || canEditAdmin;
  };

  return {
    admins,
    isLoading,
    adminToEdit,
    adminToDelete,
    adminToView,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    loadAdmins,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    handleAddAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleUpdateAdminLevel,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    isAdminEditable,
    canAdminBeDeleted,
    effectiveCanEditAdminLevel
  };
};
