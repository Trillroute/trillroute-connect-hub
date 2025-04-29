
import { useState } from 'react';
import { UserManagementUser } from '@/types/student';

export const useStudentDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<UserManagementUser | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserManagementUser | null>(null);
  const [studentToView, setStudentToView] = useState<UserManagementUser | null>(null);

  // Dialog opening functions
  const openEditDialog = (student: UserManagementUser, canEditUser: boolean, toast: any) => {
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

  const openDeleteDialog = (student: UserManagementUser) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleEditFromView = () => {
    if (studentToView) {
      setIsViewDialogOpen(false);
      setTimeout(() => {
        setStudentToEdit(studentToView);
        setIsEditDialogOpen(true);
      }, 200);
    }
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

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    studentToEdit,
    setStudentToEdit,
    studentToDelete,
    setStudentToDelete,
    studentToView,
    setStudentToView,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    handleEditFromView,
    handleDeleteFromView
  };
};
