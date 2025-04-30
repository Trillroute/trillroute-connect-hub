
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { fetchLevels, addLevel, updateLevel, deleteLevel } from './LevelService';
import { updateCachedAdminRoles } from '@/utils/adminPermissions';
import { Level } from './LevelTable';
import { ViewMode } from './ViewModeControls';
import { useAuth } from '@/hooks/useAuth';

export const useLevelManagement = (
  canAddLevel = true,
  canEditLevel = true,
  canDeleteLevel = true
) => {
  const [levels, setLevels] = useState<AdminLevelDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelDetailed | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();

  const loadLevels = async () => {
    try {
      setIsLoading(true);
      const levelsData = await fetchLevels();
      setLevels(levelsData);
      updateCachedAdminRoles(levelsData);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin levels. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  const handleCreateLevel = async (levelData: Omit<AdminLevelDetailed, 'id'>) => {
    setIsLoading(true);
    try {
      await addLevel(levelData);
      toast({ title: 'Success', description: 'Admin level created successfully.' });
      setIsCreateDialogOpen(false);
      loadLevels();
    } catch (error: any) {
      console.error('Error creating level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLevel = async (id: number, levelData: Partial<AdminLevelDetailed>) => {
    setIsLoading(true);
    try {
      await updateLevel(id, levelData);
      toast({ title: 'Success', description: 'Admin level updated successfully.' });
      setIsEditDialogOpen(false);
      setIsEditPermissionsDialogOpen(false);
      setSelectedLevel(null);
      loadLevels();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLevel = async () => {
    if (!selectedLevel) return;
    setIsLoading(true);
    try {
      await deleteLevel(selectedLevel.id);
      toast({ title: 'Success', description: 'Admin level deleted successfully.' });
      setIsDeleteDialogOpen(false);
      setSelectedLevel(null);
      loadLevels();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete admin level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setIsLoading(true);
    let deletedCount = 0;
    for (const id of ids) {
      try {
        await deleteLevel(Number(id));
        deletedCount++;
      } catch (error) {
        // continue on errors
      }
    }
    setSelectedIds([]);
    await loadLevels();
    toast({
      title: 'Success',
      description: `Deleted ${deletedCount} admin level${deletedCount !== 1 ? "s" : ""}.`,
    });
    setIsLoading(false);
  };

  // Convert Level to AdminLevelDetailed for the component props
  const openEditDialog = (level: Level) => {
    setSelectedLevel(level as unknown as AdminLevelDetailed);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (level: Level) => {
    setSelectedLevel(level as unknown as AdminLevelDetailed);
    setIsDeleteDialogOpen(true);
  };
  
  const openViewPermissionsDialog = (level: Level) => {
    setSelectedLevel(level as unknown as AdminLevelDetailed);
    setIsViewPermissionsDialogOpen(true);
  };
  
  const openEditPermissionsDialog = (level: Level) => {
    setSelectedLevel(level as unknown as AdminLevelDetailed);
    setIsEditPermissionsDialogOpen(true);
  };

  const effectiveCanAdd = canAddLevel && isSuperAdmin();
  const effectiveCanEdit = canEditLevel && isSuperAdmin();
  const effectiveCanDelete = canDeleteLevel && isSuperAdmin();

  // Format level IDs as strings for the UnifiedDataGrid and convert to Level type
  const formattedLevels: Level[] = levels.map(level => ({
    ...level,
    id: String(level.id)
  }));

  return {
    levels: formattedLevels,
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
  };
};
