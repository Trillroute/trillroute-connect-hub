
import { useState } from 'react';
import { UserManagementUser } from '@/types/student';
import { useAdminData } from './admin/useAdminData';
import { useAdminOperations } from './admin/useAdminOperations';
import { useAdminLevelManagement } from './admin/useAdminLevelManagement';
import { useAdminDialogManagement } from './admin/useAdminDialogManagement';
import { useAdminPermissions } from './admin/useAdminPermissions';

type UseAdminManagementProps = {
  canEditAdmin: boolean;
  canDeleteAdmin: boolean;
  canEditAdminLevel: boolean;
  toast: any;
};

export type ViewMode = 'list' | 'grid' | 'tile';

export const useAdminManagement = ({ 
  canEditAdmin, 
  canDeleteAdmin,
  canEditAdminLevel,
  toast 
}: UseAdminManagementProps) => {
  const { admins, isLoading: isLoadingAdmins, loadAdmins } = useAdminData();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const {
    isLoading: isOperationsLoading,
    adminToEdit,
    adminToDelete,
    adminToView,
    setAdminToEdit,
    setAdminToDelete,
    setAdminToView,
    handleAddAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin
  } = useAdminOperations(loadAdmins);
  
  const { handleUpdateAdminLevel } = useAdminLevelManagement(loadAdmins);
  
  const {
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    openEditDialog: checkEditPermission,
    openViewDialog: checkViewPermission,
    openDeleteDialog: checkDeletePermission
  } = useAdminDialogManagement();
  
  const {
    effectiveCanEditAdminLevel,
    isAdminEditable,
    canAdminBeDeleted
  } = useAdminPermissions(canEditAdmin, canDeleteAdmin, canEditAdminLevel);
  
  // Combined loading state
  const isLoading = isLoadingAdmins || isOperationsLoading;
  
  // Implement dialog opening functions that use permissions and set state
  const openEditDialog = (admin: UserManagementUser) => {
    if (checkEditPermission(admin, canEditAdmin)) {
      setAdminToEdit(admin);
      setIsEditDialogOpen(true);
    }
  };

  const openViewDialog = (admin: UserManagementUser) => {
    if (checkViewPermission()) {
      setAdminToView(admin);
      setIsViewDialogOpen(true);
    }
  };

  const openDeleteDialog = (admin: UserManagementUser) => {
    if (checkDeletePermission(canDeleteAdmin)) {
      setAdminToDelete(admin);
      setIsDeleteDialogOpen(true);
    }
  };

  // Bulk delete logic
  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      const admin = admins.find(a => a.id === id);
      // Only attempt delete if allowed
      if (admin && canAdminBeDeleted(admin)) {
        setAdminToDelete(admin);
        await handleDeleteAdmin();
      }
    }
    setSelectedIds([]);
    toast({
      title: 'Success',
      description: 'Selected administrators deleted.',
    });
    loadAdmins();
  };

  return {
    // Admin data
    admins,
    isLoading,
    
    // View state
    viewMode,
    setViewMode,
    selectedIds,
    setSelectedIds,
    
    // Dialog states
    adminToEdit,
    adminToDelete,
    adminToView,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    
    // Dialog state setters
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    
    // Operations
    loadAdmins,
    handleAddAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleUpdateAdminLevel,
    handleBulkDelete,
    
    // Dialog openers
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    
    // Permission helpers
    isAdminEditable,
    canAdminBeDeleted,
    effectiveCanEditAdminLevel
  };
};
