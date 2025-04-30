
import React from 'react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import CreateLevelDialog from './CreateLevelDialog';
import EditLevelDialog from './EditLevelDialog';
import DeleteLevelDialog from './DeleteLevelDialog';
import ViewPermissionsDialog from './ViewPermissionsDialog';
import PermissionsDialog from './PermissionsDialog';

interface LevelDialogsProps {
  selectedLevel: AdminLevelDetailed | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isViewPermissionsDialogOpen: boolean;
  isEditPermissionsDialogOpen: boolean;
  isLoading: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsViewPermissionsDialogOpen: (isOpen: boolean) => void;
  setIsEditPermissionsDialogOpen: (isOpen: boolean) => void;
  handleCreateLevel: (levelData: Omit<AdminLevelDetailed, 'id'>) => void;
  handleUpdateLevel: (id: number, levelData: Partial<AdminLevelDetailed>) => void;
  handleDeleteLevel: () => void;
}

const LevelDialogs: React.FC<LevelDialogsProps> = ({
  selectedLevel,
  isCreateDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isViewPermissionsDialogOpen, 
  isEditPermissionsDialogOpen,
  isLoading,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  setIsViewPermissionsDialogOpen,
  setIsEditPermissionsDialogOpen,
  handleCreateLevel,
  handleUpdateLevel,
  handleDeleteLevel,
}) => {
  return (
    <>
      <CreateLevelDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateLevel={handleCreateLevel}
        isLoading={isLoading}
      />

      <EditLevelDialog
        level={selectedLevel}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateLevel={handleUpdateLevel}
        isLoading={isLoading}
      />

      <DeleteLevelDialog
        level={selectedLevel}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteLevel}
        isLoading={isLoading}
      />

      <ViewPermissionsDialog
        level={selectedLevel}
        isOpen={isViewPermissionsDialogOpen}
        onOpenChange={setIsViewPermissionsDialogOpen}
      />

      <PermissionsDialog
        level={selectedLevel}
        isOpen={isEditPermissionsDialogOpen}
        onOpenChange={setIsEditPermissionsDialogOpen}
        onUpdatePermissions={handleUpdateLevel}
        isLoading={isLoading}
      />
    </>
  );
};

export default LevelDialogs;
