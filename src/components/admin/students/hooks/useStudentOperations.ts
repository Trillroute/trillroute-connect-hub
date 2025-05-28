
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { updateUser } from '@/components/admin/users/UserServiceExtended';
import { addUser } from '@/components/admin/users/UserService';
import { NewUserData } from '@/components/admin/users/AddUserDialog';

export const useStudentOperations = (loadStudents: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddStudent = async (userData: NewUserData): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Adding student:', userData);
      
      // Call the actual addUser function from UserService
      await addUser(userData);
      
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      
      // Reload the students list
      await loadStudents();
      return true;
    } catch (error) {
      console.error('Failed to add student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (id: string, userData: Partial<UserManagementUser>): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the updateUser function from UserServiceExtended
      await updateUser(id, userData);
      
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      
      await loadStudents();
    } catch (error) {
      console.error('Failed to update student:', error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock implementation - replace with actual API call
      console.log('Deleting student:', id);
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      
      await loadStudents();
      return true;
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteStudents = async (ids: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock implementation - replace with actual API call
      console.log('Bulk deleting students:', ids);
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Success",
        description: `${ids.length} students deleted successfully`,
      });
      
      await loadStudents();
    } catch (error) {
      console.error('Failed to bulk delete students:', error);
      toast({
        title: "Error",
        description: "Failed to delete students",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    bulkDeleteStudents
  };
};
