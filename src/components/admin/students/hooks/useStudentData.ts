
import { useState, useEffect } from 'react';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers } from '@/components/admin/users/UserService';
import { useToast } from '@/hooks/use-toast';

export const useStudentData = () => {
  const [students, setStudents] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setStudents(usersData.filter(user => user.role === 'student'));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    isLoading,
    loadStudents,
    setStudents
  };
};
