
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import LevelTable, { Level } from './LevelTable';
import { AdminLevelDetailed } from '@/types/adminLevel';
import CreateLevelDialog from './CreateLevelDialog';
import EditLevelDialog from './EditLevelDialog';
import DeleteLevelDialog from './DeleteLevelDialog';
import ViewPermissionsDialog from './ViewPermissionsDialog';
import LevelGrid from './LevelGrid';
import LevelHeader from './LevelHeader';
import { useToast } from '@/hooks/use-toast';
import { useLevelManagement } from './useLevelManagement';
import PermissionsDialog from './PermissionsDialog';
import LevelDialogs from './LevelDialogs';

interface LevelManagementProps {
  canAddLevel: boolean;
  canEditLevel: boolean;
  canDeleteLevel: boolean;
}

const LevelManagement: React.FC<LevelManagementProps> = ({
  canAddLevel,
  canEditLevel,
  canDeleteLevel,
}) => {
  const { toast } = useToast();

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
    effectiveCanDelete,
    visibleColumns,
    toggleColumnVisibility,
    columnOptions,
    findLevelById
  } = useLevelManagement(canAddLevel, canEditLevel, canDeleteLevel);

  // State for visible columns
  const [columns, setColumns] = useState<string[]>([]);

  // Update columns when visibleColumns changes
  useEffect(() => {
    if (visibleColumns) {
      setColumns(visibleColumns);
    }
  }, [visibleColumns]);

  // Handle opening create dialog
  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  // Convert AdminLevelDetailed[] to Level[]
  const levelsWithStringIds: Level[] = levels.map(level => ({
    ...level,
    id: String(level.id)
  }));
  
  // Handle permission updates
  const handlePermissionSave = async (levelId: number, permissions: { 
    studentPermissions: string[];
    teacherPermissions: string[];
    adminPermissions: string[];
    leadPermissions: string[];
    coursePermissions: string[];
    levelPermissions: string[];
    eventsPermissions: string[];
    classTypesPermissions: string[];
    userAvailabilityPermissions: string[];
  }) => {
    try {
      await handleUpdateLevel(levelId, permissions);
      toast({
        title: 'Success',
        description: 'Permissions updated successfully',
      });
      setIsEditPermissionsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permissions',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <LevelHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        setColumns={setColumns}
        selectedIds={selectedIds}
        onBulkDelete={selectedIds.length > 0 ? () => handleBulkDelete(selectedIds) : undefined}
        onCreateClick={effectiveCanAdd ? handleCreateClick : undefined}
      />

      <Card>
        {viewMode === 'table' ? (
          <LevelTable
            levels={levelsWithStringIds}
            isLoading={isLoading}
            onEdit={effectiveCanEdit ? (level) => openEditDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            onDelete={effectiveCanDelete ? (level) => openDeleteDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            onViewPermissions={(level) => openViewPermissionsDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            })}
            onEditPermissions={effectiveCanEdit ? (level) => openEditPermissionsDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            visibleColumns={columns}
          />
        ) : (
          <LevelGrid
            levels={levelsWithStringIds}
            isLoading={isLoading}
            onEdit={effectiveCanEdit ? (level) => openEditDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            onDelete={effectiveCanDelete ? (level) => openDeleteDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            onViewPermissions={(level) => openViewPermissionsDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            })}
            onEditPermissions={effectiveCanEdit ? (level) => openEditPermissionsDialog({
              ...level,
              id: Number(level.id),
              eventsPermissions: level.eventsPermissions || [],
              classTypesPermissions: level.classTypesPermissions || [],
              userAvailabilityPermissions: level.userAvailabilityPermissions || []
            }) : undefined}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        )}
      </Card>

      {/* Dialogs */}
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
    </div>
  );
};

export default LevelManagement;
