
import { useState, useCallback } from 'react';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers } from '../../users/UserService';
import { useToast } from '@/hooks/use-toast';

export const useAdminData = () => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return {
    admins,
    isLoading,
    loadAdmins
  };
};
