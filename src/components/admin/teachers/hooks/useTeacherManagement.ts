
import { useState, useEffect } from 'react';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers, addUser, deleteUser } from '@/components/admin/users/UserService';
import { updateUser } from '@/components/admin/users/UserServiceExtended';
import { useToast } from '@/hooks/use-toast';

export const useTeacherManagement = (
  canAddUser = true,
  canEditUser = true,
  canDeleteUser = true
) => {
  const [teachers, setTeachers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<UserManagementUser | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<UserManagementUser | null>(null);
  const [teacherToView, setTeacherToView] = useState<UserManagementUser | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const { toast } = useToast();

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const usersData = await fetchAllUsers();
      setTeachers(usersData.filter(user => user.role === 'teacher'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teachers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleAddTeacher = async (userData: any) => {
    try {
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      userData.role = 'teacher';
      
      setIsLoading(true);
      await addUser(userData);

      toast({
        title: 'Success',
        description: 'Teacher added successfully.',
      });
      
      setIsAddDialogOpen(false);
      loadTeachers();
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTeacher = async (userId: string, userData: Partial<UserManagementUser>) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userData);

      toast({
        title: 'Success',
        description: 'Teacher updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      setTeacherToEdit(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Error updating teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    
    try {
      setIsLoading(true);
      await deleteUser(teacherToDelete.id);

      toast({
        title: 'Success',
        description: 'Teacher removed successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteTeachers = async () => {
    if (selectedTeachers.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedTeachers.length} teachers? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedTeachers) {
        await deleteUser(id);
      }
      toast({
        title: "Success",
        description: `Deleted ${selectedTeachers.length} teachers successfully.`,
      });
      setSelectedTeachers([]);
      loadTeachers();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to bulk delete teachers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (teacher: UserManagementUser) => {
    if (!canEditUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit teachers.",
        variant: "destructive",
      });
      return;
    }
    setTeacherToEdit(teacher);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (teacher: UserManagementUser) => {
    setTeacherToView(teacher);
    setIsViewDialogOpen(true);
  };

  const handleEditFromView = () => {
    if (teacherToView) {
      setIsViewDialogOpen(false);
      setTimeout(() => {
        openEditDialog(teacherToView);
      }, 200);
    }
  };

  const openDeleteDialog = (teacher: UserManagementUser) => {
    if (!canDeleteUser) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete teachers.",
        variant: "destructive",
      });
      return;
    }
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFromView = () => {
    if (teacherToView && canDeleteUser) {
      setTeacherToDelete(teacherToView);
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }
  };

  const canTeacherBeDeleted = (teacher: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true;
  };

  return {
    teachers,
    isLoading,
    loadTeachers,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    teacherToEdit,
    teacherToDelete,
    teacherToView,
    selectedTeachers,
    setSelectedTeachers,
    viewMode,
    setViewMode,
    handleAddTeacher,
    handleUpdateTeacher,
    handleDeleteTeacher,
    bulkDeleteTeachers,
    openEditDialog,
    openViewDialog,
    handleEditFromView,
    openDeleteDialog,
    handleDeleteFromView,
    canTeacherBeDeleted
  };
};
