
import { useState, useEffect } from 'react';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers, addUser, deleteUser } from '@/components/admin/users/UserService';
import { updateUser } from '@/components/admin/users/UserServiceExtended';
import { useToast } from '@/hooks/use-toast';

export const useStudentManagement = (
  canAddUser = true,
  canEditUser = true,
  canDeleteUser = true
) => {
  const [students, setStudents] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<UserManagementUser | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserManagementUser | null>(null);
  const [studentToView, setStudentToView] = useState<UserManagementUser | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
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
      
      setIsAddDialogOpen(false);
      loadStudents();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student. Please try again.',
        variant: 'destructive',
      });
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
      
      setIsEditDialogOpen(false);
      setStudentToEdit(null);
      loadStudents();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(studentToDelete.id);

      toast({
        title: 'Success',
        description: 'Student removed successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteStudents = async () => {
    if (selectedStudents.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} students? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedStudents) {
        await deleteUser(id);
      }
      toast({
        title: "Success",
        description: `Deleted ${selectedStudents.length} students successfully.`,
      });
      setSelectedStudents([]);
      loadStudents();
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

  const openEditDialog = (student: UserManagementUser) => {
    if (!canEditUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit students.",
        variant: "destructive",
      });
      return;
    }
    setStudentToEdit(student);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (student: UserManagementUser) => {
    setStudentToView(student);
    setIsViewDialogOpen(true);
  };

  const handleEditFromView = () => {
    if (studentToView) {
      setIsViewDialogOpen(false);
      setTimeout(() => {
        openEditDialog(studentToView);
      }, 200);
    }
  };

  const openDeleteDialog = (student: UserManagementUser) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFromView = () => {
    if (studentToView) {
      setStudentToDelete(studentToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  const canStudentBeDeleted = (student: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true;
  };

  return {
    students,
    isLoading,
    loadStudents,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    studentToEdit,
    studentToDelete,
    studentToView,
    selectedStudents,
    setSelectedStudents,
    viewMode,
    setViewMode,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    bulkDeleteStudents,
    openEditDialog,
    openViewDialog,
    handleEditFromView,
    openDeleteDialog,
    handleDeleteFromView,
    canStudentBeDeleted
  };
};
