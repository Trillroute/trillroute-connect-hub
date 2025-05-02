
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import LevelTable, { Level } from './LevelTable';
import { useLevelManagement } from './useLevelManagement';
import LevelHeader from './LevelHeader';
import ViewModeControls from './ViewModeControls';
import LevelDialogs from './LevelDialogs';
import { AdminLevelDetailed } from '@/types/adminLevel';

interface LevelManagementProps {
  canAddLevel?: boolean;
  canEditLevel?: boolean;
  canDeleteLevel?: boolean;
}

// Helper function to convert AdminLevelDetailed[] to Level[]
const convertToLevels = (adminLevels: AdminLevelDetailed[]): Level[] => {
  return adminLevels.map(level => ({
    ...level,
    id: String(level.id) // Convert number id to string id
  }));
};

const LevelManagement = ({
  canAddLevel = true,
  canEditLevel = true,
  canDeleteLevel = true,
}: LevelManagementProps) => {
  const {
    levels: adminLevels,
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
    effectiveCanDelete,
    visibleColumns,
    toggleColumnVisibility,
    columnOptions
  } = useLevelManagement(canAddLevel, canEditLevel, canDeleteLevel);

  // Convert AdminLevelDetailed[] to Level[] for LevelTable
  const levels = convertToLevels(adminLevels);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <LevelHeader 
            onRefresh={loadLevels}
            onCreateLevel={() => setIsCreateDialogOpen(true)}
            canAddLevel={effectiveCanAdd}
          />
          <ViewModeControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            visibleColumns={visibleColumns}
            onColumnVisibilityChange={toggleColumnVisibility}
            columnOptions={columnOptions}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <LevelTable
          levels={levels}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onViewPermissions={effectiveCanEdit ? openEditPermissionsDialog : openViewPermissionsDialog}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onBulkDelete={effectiveCanDelete ? handleBulkDelete : undefined}
          visibleColumns={visibleColumns}
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
