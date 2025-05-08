
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
  handleCreateLevel: (levelData: Omit<AdminLevelDetailed, 'id'>) => Promise<boolean>;
  handleUpdateLevel: (id: number, levelData: Partial<AdminLevelDetailed>) => Promise<boolean>;
  handleDeleteLevel: (level: AdminLevelDetailed | null) => Promise<boolean>;
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
      {isCreateDialogOpen && (
        <CreateLevelDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateLevel={handleCreateLevel}
          isLoading={isLoading}
        />
      )}

      {selectedLevel && isEditDialogOpen && (
        <EditLevelDialog
          level={selectedLevel}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateLevel={handleUpdateLevel}
          isLoading={isLoading}
        />
      )}

      {selectedLevel && isDeleteDialogOpen && (
        <DeleteLevelDialog
          level={selectedLevel}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={() => handleDeleteLevel(selectedLevel)}
          isLoading={isLoading}
        />
      )}

      {selectedLevel && isViewPermissionsDialogOpen && (
        <ViewPermissionsDialog
          level={selectedLevel}
          isOpen={isViewPermissionsDialogOpen}
          onOpenChange={setIsViewPermissionsDialogOpen}
        />
      )}

      {selectedLevel && isEditPermissionsDialogOpen && (
        <PermissionsDialog
          level={selectedLevel}
          isOpen={isEditPermissionsDialogOpen}
          onOpenChange={setIsEditPermissionsDialogOpen}
          onUpdatePermissions={handleUpdateLevel}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default LevelDialogs;
