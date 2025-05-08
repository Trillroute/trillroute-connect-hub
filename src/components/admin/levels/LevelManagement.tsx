
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
  // State for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [columns, setColumns] = useState<string[]>(['name', 'description', 'permissions']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelDetailed | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { toast } = useToast();

  const {
    levels,
    isLoading,
    fetchLevels,
    createLevel,
    updateLevel,
    deleteLevel,
    bulkDeleteLevels,
    setLevelPermissions
  } = useLevelManagement();

  // Handle opening create dialog
  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditClick = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsEditDialogOpen(true);
  };

  // Handle opening delete dialog
  const handleDeleteClick = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsDeleteDialogOpen(true);
  };

  // Handle opening view permissions dialog
  const handleViewPermissionsClick = (level: AdminLevelDetailed) => {
    setSelectedLevel(level);
    setIsViewPermissionsDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await bulkDeleteLevels(selectedIds);
      setSelectedIds([]);
      toast({
        title: 'Success',
        description: `${selectedIds.length} levels deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete levels',
        variant: 'destructive',
      });
    }
  };

  // Handle permission updates - ensure we're using string[] for permissions
  const handlePermissionSave = async (levelId: number, permissions: { 
    studentPermissions: string[];
    teacherPermissions: string[];
    adminPermissions: string[];
    leadPermissions: string[];
    coursePermissions: string[];
  }) => {
    try {
      await setLevelPermissions(levelId, permissions);
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
        onCreateClick={canAddLevel ? handleCreateClick : undefined}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        setColumns={setColumns}
        selectedIds={selectedIds}
        onBulkDelete={canDeleteLevel && selectedIds.length > 0 ? handleBulkDelete : undefined}
      />

      <Card>
        {viewMode === 'table' ? (
          <LevelTable
            levels={levels}
            isLoading={isLoading}
            onEdit={canEditLevel ? handleEditClick : () => {}}
            onDelete={canDeleteLevel ? handleDeleteClick : () => {}}
            onViewPermissions={handleViewPermissionsClick}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBulkDelete={canDeleteLevel ? handleBulkDelete : undefined}
            visibleColumns={columns}
          />
        ) : (
          <LevelGrid
            levels={levels}
            isLoading={isLoading}
            onEdit={canEditLevel ? handleEditClick : () => {}}
            onDelete={canDeleteLevel ? handleDeleteClick : () => {}}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBulkDelete={canDeleteLevel ? handleBulkDelete : undefined}
          />
        )}
      </Card>

      {/* Dialogs */}
      {isCreateDialogOpen && (
        <CreateLevelDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onLevelCreated={fetchLevels}
        />
      )}
      {selectedLevel && isEditDialogOpen && (
        <EditLevelDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          level={selectedLevel}
          onLevelUpdated={fetchLevels}
        />
      )}
      {selectedLevel && isDeleteDialogOpen && (
        <DeleteLevelDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          level={selectedLevel}
          onLevelDeleted={fetchLevels}
        />
      )}
      {selectedLevel && isViewPermissionsDialogOpen && (
        <ViewPermissionsDialog
          open={isViewPermissionsDialogOpen}
          onOpenChange={setIsViewPermissionsDialogOpen}
          level={selectedLevel}
          onSavePermissions={handlePermissionSave}
        />
      )}
    </div>
  );
};

export default LevelManagement;
