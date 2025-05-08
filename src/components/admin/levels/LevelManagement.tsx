
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import LevelTable from './LevelTable';
import { AdminLevelDetailed } from '@/types/adminLevel';
import CreateLevelDialog from './CreateLevelDialog';
import EditLevelDialog from './EditLevelDialog';
import DeleteLevelDialog from './DeleteLevelDialog';
import ViewPermissionsDialog from './ViewPermissionsDialog';
import LevelGrid from './LevelGrid';
import ViewModeControls from './ViewModeControls';
import LevelHeader from './LevelHeader';
import { useToast } from '@/hooks/use-toast';
import { useLevelManagement } from './useLevelManagement';
import { Level } from './LevelTable';

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
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewPermissionsDialogOpen,
    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleBulkDelete,
    openEditDialog,
    openDeleteDialog,
    openViewPermissionsDialog,
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
  const [columns, setColumns] = useState<string[]>(visibleColumns || ['name', 'description', 'permissions']);

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
  }) => {
    try {
      await handleUpdateLevel(levelId, permissions);
      toast({
        title: 'Success',
        description: 'Permissions updated successfully',
      });
      setIsViewPermissionsDialogOpen(false);
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
        onBulkDelete={effectiveCanDelete && selectedIds.length > 0 ? handleBulkDelete : undefined}
        onCreateClick={effectiveCanAdd ? handleCreateClick : undefined}
      />

      <Card>
        {viewMode === 'table' ? (
          <LevelTable
            levels={levelsWithStringIds}
            isLoading={isLoading}
            onEdit={effectiveCanEdit ? (level) => openEditDialog({...level, id: Number(level.id)}) : () => {}}
            onDelete={effectiveCanDelete ? (level) => openDeleteDialog({...level, id: Number(level.id)}) : () => {}}
            onViewPermissions={(level) => openViewPermissionsDialog({...level, id: Number(level.id)})}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBulkDelete={effectiveCanDelete ? handleBulkDelete : undefined}
            visibleColumns={columns}
          />
        ) : (
          <LevelGrid
            levels={levelsWithStringIds}
            isLoading={isLoading}
            onEdit={effectiveCanEdit ? (level) => openEditDialog({...level, id: Number(level.id)}) : undefined}
            onDelete={effectiveCanDelete ? (level) => openDeleteDialog({...level, id: Number(level.id)}) : undefined}
            onViewPermissions={(level) => openViewPermissionsDialog({...level, id: Number(level.id)})}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBulkDelete={effectiveCanDelete ? handleBulkDelete : undefined}
          />
        )}
      </Card>

      {/* Dialogs */}
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
          onDelete={() => handleDeleteLevel()}
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
    </div>
  );
};

export default LevelManagement;
