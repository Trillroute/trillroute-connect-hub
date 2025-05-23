
import { useState } from 'react';
import { AdminLevelDetailed } from '@/types/adminLevel';

export function useLevelDialogs() {
  // Dialog states
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelDetailed | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);

  // Dialog openers
  const openEditDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsDeleteDialogOpen(true);
  };

  const openViewPermissionsDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsViewPermissionsDialogOpen(true);
  };

  const openEditPermissionsDialog = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsEditPermissionsDialogOpen(true);
  };

  // Reset all dialog states
  const resetDialogStates = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsViewPermissionsDialogOpen(false);
    setIsEditPermissionsDialogOpen(false);
    setSelectedLevel(null);
  };

  return {
    selectedLevel,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewPermissionsDialogOpen,
    isEditPermissionsDialogOpen,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewPermissionsDialogOpen,
    setIsEditPermissionsDialogOpen,
    openEditDialog,
    openDeleteDialog,
    openViewPermissionsDialog,
    openEditPermissionsDialog,
    resetDialogStates,
  };
}
