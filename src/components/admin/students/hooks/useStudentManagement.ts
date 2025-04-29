
import { useStudentData } from './useStudentData';
import { useStudentDialogs } from './useStudentDialogs';
import { useStudentOperations } from './useStudentOperations';
import { useStudentDisplay } from './useStudentDisplay';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';

export const useStudentManagement = (
  canAddUser = true,
  canEditUser = true,
  canDeleteUser = true
) => {
  const { students, isLoading: isDataLoading, loadStudents } = useStudentData();
  const { 
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    isViewDialogOpen, setIsViewDialogOpen,
    studentToEdit, studentToDelete, studentToView,
    openViewDialog: baseOpenViewDialog,
    openEditDialog: baseOpenEditDialog,
    openDeleteDialog: baseOpenDeleteDialog,
    handleEditFromView,
    handleDeleteFromView
  } = useStudentDialogs();
  
  const { 
    isLoading: isOperationsLoading, 
    handleAddStudent, 
    handleUpdateStudent, 
    handleDeleteStudent,
    bulkDeleteStudents
  } = useStudentOperations(loadStudents);
  
  const { selectedStudents, setSelectedStudents, viewMode, setViewMode } = useStudentDisplay();
  const { toast } = useToast();

  // Combined loading state
  const isLoading = isDataLoading || isOperationsLoading;

  // Permission-aware wrapper functions
  const openEditDialog = (student: UserManagementUser) => {
    baseOpenEditDialog(student, canEditUser, toast);
  };

  const canStudentBeDeleted = (student: UserManagementUser) => {
    if (!canDeleteUser) return false;
    return true;
  };

  const wrappedHandleDeleteStudent = async () => {
    if (!studentToDelete) return;
    await handleDeleteStudent(studentToDelete.id);
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
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
    handleAddStudent: async (userData: any) => {
      const success = await handleAddStudent(userData);
      if (success) {
        setIsAddDialogOpen(false);
        loadStudents();
      }
    },
    handleUpdateStudent,
    handleDeleteStudent: wrappedHandleDeleteStudent,
    bulkDeleteStudents,
    openEditDialog,
    openViewDialog: baseOpenViewDialog,
    handleEditFromView,
    openDeleteDialog: baseOpenDeleteDialog,
    handleDeleteFromView,
    canStudentBeDeleted
  };
};
