
import React from 'react';
import { UserManagementUser } from '@/types/student';
import AddUserDialog from '@/components/admin/users/AddUserDialog';
import EditUserDialog from '@/components/admin/users/EditUserDialog';
import DeleteUserDialog from '@/components/admin/users/DeleteUserDialog';
import ViewUserDialog from '@/components/admin/users/ViewUserDialog';
import { NewUserData } from '@/components/admin/users/AddUserDialog';

interface TeacherDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTeacher: (userData: NewUserData) => Promise<void>;
  
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateTeacher: (userId: string, userData: Partial<UserManagementUser>) => Promise<void>;
  teacherToEdit: UserManagementUser | null;
  
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteTeacher: () => Promise<void>;
  teacherToDelete: UserManagementUser | null;
  
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teacherToView: UserManagementUser | null;
  
  handleEditFromView: () => void;
  handleDeleteFromView: () => void;
  isLoading: boolean;
  
  canEditUser: boolean;
  canDeleteUser: boolean;
}

const TeacherDialogs: React.FC<TeacherDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  handleAddTeacher,
  
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleUpdateTeacher,
  teacherToEdit,
  
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteTeacher,
  teacherToDelete,
  
  isViewDialogOpen,
  setIsViewDialogOpen,
  teacherToView,
  
  handleEditFromView,
  handleDeleteFromView,
  isLoading,
  
  canEditUser,
  canDeleteUser,
}) => {
  return (
    <>
      <AddUserDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddUser={handleAddTeacher}
        isLoading={isLoading}
        allowAdminCreation={false}
        defaultRole="teacher"
        title="Add Teacher"
      />

      <EditUserDialog
        user={teacherToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateUser={handleUpdateTeacher}
        isLoading={isLoading}
        userRole="Teacher"
      />
      
      <DeleteUserDialog
        user={teacherToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTeacher}
        isLoading={isLoading}
        userRole="Teacher"
      />
      
      <ViewUserDialog
        user={teacherToView}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEditFromView={canEditUser ? handleEditFromView : undefined}
        onDeleteUser={canDeleteUser ? handleDeleteFromView : undefined}
        canDeleteUser={canDeleteUser}
      />
    </>
  );
};

export default TeacherDialogs;
