
import { useState } from 'react';
import { UserManagementUser } from '@/types/student';
import { NewUserData } from '../../users/AddUserDialog';
import { addUser, deleteUser } from '../../users/UserService';
import { updateUser } from '../../users/UserServiceExtended';
import { useToast } from '@/hooks/use-toast';

export const useAdminOperations = (loadAdmins: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<UserManagementUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<UserManagementUser | null>(null);
  const [adminToView, setAdminToView] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();

  const handleAddAdmin = async (userData: NewUserData) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return false;
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

  return {
    isLoading,
    adminToEdit,
    adminToDelete,
    adminToView,
    setAdminToEdit,
    setAdminToDelete,
    setAdminToView,
    handleAddAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin
  };
};
