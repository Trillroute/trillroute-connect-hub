
import { useState } from 'react';
import { updateAdminLevel } from '../../users/UserService';
import { useToast } from '@/hooks/use-toast';

export const useAdminLevelManagement = (loadAdmins: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return {
    handleUpdateAdminLevel,
    isUpdatingLevel: isLoading
  };
};
