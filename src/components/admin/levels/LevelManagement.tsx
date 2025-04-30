
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import LevelTable from './LevelTable';
import { useLevelManagement } from './useLevelManagement';
import LevelHeader from './LevelHeader';
import ViewModeControls from './ViewModeControls';
import LevelDialogs from './LevelDialogs';

interface LevelManagementProps {
  canAddLevel?: boolean;
  canEditLevel?: boolean;
  canDeleteLevel?: boolean;
}

const LevelManagement = ({
  canAddLevel = true,
  canEditLevel = true,
  canDeleteLevel = true,
}: LevelManagementProps) => {
  const {
    levels,
    isLoading,
    selectedIds,
    setSelectedIds,
    viewMode,
    setViewMode,
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
    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleBulkDelete,
    openEditDialog,
    openDeleteDialog,
    openViewPermissionsDialog,
    openEditPermissionsDialog,
    loadLevels,
    effectiveCanAdd,
    effectiveCanEdit,
    effectiveCanDelete
  } = useLevelManagement(canAddLevel, canEditLevel, canDeleteLevel);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <LevelHeader 
            onRefresh={loadLevels}
            onCreateLevel={() => setIsCreateDialogOpen(true)}
            canAddLevel={effectiveCanAdd}
          />
          <ViewModeControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </CardHeader>
      <CardContent>
        <LevelTable
          levels={levels}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onViewPermissions={effectiveCanEdit ? openEditPermissionsDialog : openViewPermissionsDialog}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onBulkDelete={effectiveCanDelete ? handleBulkDelete : undefined}
        />

        <LevelDialogs
          selectedLevel={selectedLevel}
          isCreateDialogOpen={isCreateDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          isViewPermissionsDialogOpen={isViewPermissionsDialogOpen}
          isEditPermissionsDialogOpen={isEditPermissionsDialogOpen}
          isLoading={isLoading}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setIsViewPermissionsDialogOpen={setIsViewPermissionsDialogOpen}
          setIsEditPermissionsDialogOpen={setIsEditPermissionsDialogOpen}
          handleCreateLevel={handleCreateLevel}
          handleUpdateLevel={handleUpdateLevel}
          handleDeleteLevel={handleDeleteLevel}
        />
      </CardContent>
    </Card>
  );
};

export default LevelManagement;
