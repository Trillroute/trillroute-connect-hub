
import React, { useEffect } from 'react';
import { UserManagementUser } from '@/types/student';
import AddUserDialog, { NewUserData } from '../users/AddUserDialog';
import DeleteUserDialog from '../users/DeleteUserDialog';
import ViewUserDialog from '../users/ViewUserDialog';
import EditUserDialog from '../users/EditUserDialog';
import { useAuth } from '@/hooks/useAuth';

interface AdminDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  adminToEdit: UserManagementUser | null;
  adminToDelete: UserManagementUser | null;
  adminToView: UserManagementUser | null;
  handleAddAdmin: (userData: NewUserData) => Promise<boolean>;
  handleUpdateAdmin: (userId: string, userData: Partial<UserManagementUser>) => Promise<boolean>;
  handleDeleteAdmin: () => Promise<boolean>;
  handleUpdateAdminLevel: (userId: string, newLevelName: string) => Promise<boolean>;
  isLoading: boolean;
  canAddAdmin: boolean;
  effectiveCanEditAdminLevel: boolean;
}

const AdminDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  adminToEdit,
  adminToDelete,
  adminToView,
  handleAddAdmin,
  handleUpdateAdmin,
  handleDeleteAdmin,
  handleUpdateAdminLevel,
  isLoading,
  canAddAdmin,
  effectiveCanEditAdminLevel
}: AdminDialogsProps) => {
  const { isSuperAdmin } = useAuth();

  // Wrapper functions to convert Promise<boolean> to Promise<void>
  const handleUpdateAdminWrapper = async (userId: string, userData: Partial<UserManagementUser>): Promise<void> => {
    await handleUpdateAdmin(userId, userData);
  };

  const handleUpdateAdminLevelWrapper = async (userId: string, newLevelName: string): Promise<void> => {
    await handleUpdateAdminLevel(userId, newLevelName);
  };

  useEffect(() => {
    if (isEditDialogOpen && adminToEdit) {
      console.log('AdminDialogs: Edit dialog opened with admin:', adminToEdit);
      console.log('AdminDialogs: effectiveCanEditAdminLevel =', effectiveCanEditAdminLevel);
      console.log('AdminDialogs: Is super admin =', isSuperAdmin());
      console.log('AdminDialogs: Using onUpdateLevel =', Boolean(effectiveCanEditAdminLevel));
    }
  }, [isEditDialogOpen, adminToEdit, effectiveCanEditAdminLevel, isSuperAdmin]);

  return (
    <>
      {(canAddAdmin || isSuperAdmin()) && (
        <AddUserDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddAdmin}
          isLoading={isLoading}
          allowAdminCreation={true}
          defaultRole="admin"
          title="Add Administrator"
        />
      )}
      
      <EditUserDialog
        user={adminToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateUser={handleUpdateAdminWrapper}
        onUpdateLevel={effectiveCanEditAdminLevel ? handleUpdateAdminLevelWrapper : undefined}
        isLoading={isLoading}
        userRole="Administrator"
        showAdminLevelSelector={true} // Force show the admin level selector
      />
      
      <DeleteUserDialog
        user={adminToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteAdmin}
        isLoading={isLoading}
        userRole="Administrator"
      />
      
      <ViewUserDialog
        user={adminToView}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </>
  );
};

export default AdminDialogs;
