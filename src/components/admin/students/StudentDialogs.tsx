
import React from "react";
import { UserManagementUser } from "@/types/student";
import AddUserDialog, { NewUserData } from "../users/AddUserDialog";
import EditUserDialog from "../users/EditUserDialog";
import DeleteUserDialog from "../users/DeleteUserDialog";
import ViewUserDialog from "../users/ViewUserDialog";

interface StudentDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  handleAddStudent: (user: NewUserData) => Promise<void>; // Change to Promise<void>
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  handleUpdateStudent: (id: string, userData: Partial<UserManagementUser>) => Promise<void>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteStudent: () => Promise<void>;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  studentToEdit: UserManagementUser | null;
  studentToDelete: UserManagementUser | null;
  studentToView: UserManagementUser | null;
  handleEditFromView: () => void;
  handleDeleteFromView: () => void;
  isLoading: boolean;
  canEditUser: boolean;
  canDeleteUser: boolean;
}

const StudentDialogs: React.FC<StudentDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  handleAddStudent,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleUpdateStudent,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteStudent,
  isViewDialogOpen,
  setIsViewDialogOpen,
  studentToEdit,
  studentToDelete,
  studentToView,
  handleEditFromView,
  handleDeleteFromView,
  isLoading,
  canEditUser,
  canDeleteUser
}) => (
  <>
    <AddUserDialog
      isOpen={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      onAddUser={handleAddStudent}
      isLoading={isLoading}
      allowAdminCreation={false}
      defaultRole="student"
      title="Add Student"
    />

    <EditUserDialog
      user={studentToEdit}
      isOpen={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      onUpdateUser={handleUpdateStudent}
      isLoading={isLoading}
      userRole="Student"
    />
    
    <DeleteUserDialog
      user={studentToDelete}
      isOpen={isDeleteDialogOpen}
      onOpenChange={setIsDeleteDialogOpen}
      onDelete={handleDeleteStudent}
      isLoading={isLoading}
      userRole="Student"
    />
    
    <ViewUserDialog
      user={studentToView}
      isOpen={isViewDialogOpen}
      onOpenChange={setIsViewDialogOpen}
      onEditFromView={canEditUser ? handleEditFromView : undefined}
      onDeleteUser={canDeleteUser ? handleDeleteFromView : undefined}
      canDeleteUser={canDeleteUser}
    />
  </>
);

export default StudentDialogs;
