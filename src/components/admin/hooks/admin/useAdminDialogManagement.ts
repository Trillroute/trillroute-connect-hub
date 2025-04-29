
import { useState } from 'react';
import { UserManagementUser } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useAdminDialogManagement = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { isSuperAdmin } = useAuth();
  const { toast } = useToast();

  const openEditDialog = (admin: UserManagementUser, canEditAdmin: boolean) => {
    if (!canEditAdmin && !isSuperAdmin()) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit administrators.",
        variant: "destructive",
      });
      return;
    }
    return true;
  };

  const openViewDialog = () => {
    return true;
  };

  const openDeleteDialog = (canDeleteAdmin: boolean) => {
    if (!canDeleteAdmin && !isSuperAdmin()) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete administrators.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    openEditDialog,
    openViewDialog,
    openDeleteDialog
  };
};
