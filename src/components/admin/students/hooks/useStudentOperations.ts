
import { useState } from 'react';
import { UserManagementUser } from '@/types/student';
import { addUser, deleteUser } from '@/components/admin/users/UserService';
import { updateUser } from '@/components/admin/users/UserServiceExtended';
import { useToast } from '@/hooks/use-toast';
import { logUserActivity } from '@/utils/activity/activityLogger';
import { useAuth } from '@/hooks/useAuth';

export const useStudentOperations = (loadStudents: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddStudent = async (userData: any) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      userData.role = 'student';
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: 'Student added successfully.',
      });
      
      if (user) {
        logUserActivity(user.id, 'add', 'student');
      }
      
      return true;
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (userId: string, userData: Partial<UserManagementUser>): Promise<void> => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Student updated successfully.',
      });
      
      if (user) {
        logUserActivity(user.id, 'update', 'student', userId);
      }
      
      await loadStudents();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student. Please try again.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string): Promise<void> => {
    if (!studentId) return Promise.reject(new Error('No student ID provided'));
    
    try {
      setIsLoading(true);
      await deleteUser(studentId);

      toast({
        title: 'Success',
        description: 'Student removed successfully.',
      });
      
      if (user) {
        logUserActivity(user.id, 'delete', 'student', studentId);
      }
      
      await loadStudents();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student. Please try again.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteStudents = async (selectedStudents: string[]) => {
    if (selectedStudents.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} students? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedStudents) {
        await deleteUser(id);
        if (user) {
          logUserActivity(user.id, 'bulk-delete', 'student', id);
        }
      }
      toast({
        title: "Success",
        description: `Deleted ${selectedStudents.length} students successfully.`,
      });
      await loadStudents();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to bulk delete students.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    bulkDeleteStudents,
  };
};
