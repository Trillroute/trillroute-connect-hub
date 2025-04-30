
import { useState, useEffect, useCallback } from 'react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { fetchLevels, deleteLevel as deleteLevelApi, createLevel, updateLevel } from './LevelService';
import { useToast } from '@/hooks/use-toast';
import { ViewMode } from './ViewModeControls';
import { Level } from './LevelTable';

export function useLevelManagement(
  canAddLevel: boolean = true,
  canEditLevel: boolean = true,
  canDeleteLevel: boolean = true
) {
  const [levels, setLevels] = useState<AdminLevelDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelDetailed | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    description: true,
    studentPermissions: true,
    teacherPermissions: true,
    adminPermissions: true,
    leadPermissions: true,
    coursePermissions: true,
    levelPermissions: true
  });
  
  // Column options for dropdown
  const columnOptions = [
    { field: 'name', label: 'Level Name' },
    { field: 'description', label: 'Description' },
    { field: 'studentPermissions', label: 'Student Permissions' },
    { field: 'teacherPermissions', label: 'Teacher Permissions' },
    { field: 'adminPermissions', label: 'Admin Permissions' },
    { field: 'leadPermissions', label: 'Lead Permissions' },
    { field: 'coursePermissions', label: 'Course Permissions' },
    { field: 'levelPermissions', label: 'Level Permissions' }
  ];

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((field: string, isVisible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [field]: isVisible
    }));
  }, []);

  // Fetch levels
  const loadLevels = async () => {
    setIsLoading(true);
    try {
      const levelsData = await fetchLevels();
      setLevels(levelsData);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch levels. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load levels on mount
  useEffect(() => {
    loadLevels();
  }, []);

  // Effect for setting effective permissions
  const [effectiveCanAdd, setEffectiveCanAdd] = useState(canAddLevel);
  const [effectiveCanEdit, setEffectiveCanEdit] = useState(canEditLevel);
  const [effectiveCanDelete, setEffectiveCanDelete] = useState(canDeleteLevel);

  useEffect(() => {
    setEffectiveCanAdd(canAddLevel);
    setEffectiveCanEdit(canEditLevel);
    setEffectiveCanDelete(canDeleteLevel);
  }, [canAddLevel, canEditLevel, canDeleteLevel]);

  // Handlers for CRUD operations
  const handleCreateLevel = async (levelData: Omit<AdminLevelDetailed, 'id'>) => {
    setIsLoading(true);
    try {
      await createLevel(levelData);
      toast({
        title: 'Success',
        description: 'Level created successfully',
      });
      setIsCreateDialogOpen(false);
      loadLevels();
    } catch (error) {
      console.error('Error creating level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create level. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLevel = async (id: number, levelData: Partial<AdminLevelDetailed>) => {
    setIsLoading(true);
    try {
      await updateLevel(id, levelData);
      toast({
        title: 'Success',
        description: 'Level updated successfully',
      });
      setIsEditDialogOpen(false);
      setIsEditPermissionsDialogOpen(false);
      loadLevels();
    } catch (error) {
      console.error('Error updating level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update level. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLevel = async () => {
    if (!selectedLevel) return;
    setIsLoading(true);
    try {
      await deleteLevelApi(selectedLevel.id);
      toast({
        title: 'Success',
        description: 'Level deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setSelectedLevel(null);
      loadLevels();
    } catch (error) {
      console.error('Error deleting level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete level. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setIsLoading(true);
    try {
      // Convert string IDs to numbers
      const numericIds = ids.map(id => parseInt(id, 10));
      
      // Execute delete operations for all selected IDs
      await Promise.all(numericIds.map(id => deleteLevelApi(id)));
      
      toast({
        title: 'Success',
        description: `${ids.length} levels deleted successfully`,
      });
      
      setSelectedIds([]);
      loadLevels();
    } catch (error) {
      console.error('Error during bulk delete:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete some or all levels. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find AdminLevelDetailed by Level
  const findAdminLevelByLevel = (level: Level): AdminLevelDetailed | null => {
    const adminLevel = levels.find(l => String(l.id) === level.id) || null;
    return adminLevel;
  };

  // Dialog control handlers
  const openEditDialog = (level: Level) => {
    const adminLevel = findAdminLevelByLevel(level);
    if (adminLevel) {
      setSelectedLevel(adminLevel);
      setIsEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (level: Level) => {
    const adminLevel = findAdminLevelByLevel(level);
    if (adminLevel) {
      setSelectedLevel(adminLevel);
      setIsDeleteDialogOpen(true);
    }
  };

  const openViewPermissionsDialog = (level: Level) => {
    const adminLevel = findAdminLevelByLevel(level);
    if (adminLevel) {
      setSelectedLevel(adminLevel);
      setIsViewPermissionsDialogOpen(true);
    }
  };

  const openEditPermissionsDialog = (level: Level) => {
    const adminLevel = findAdminLevelByLevel(level);
    if (adminLevel) {
      setSelectedLevel(adminLevel);
      setIsEditPermissionsDialogOpen(true);
    }
  };

  return {
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
    setVisibleColumns,
    toggleColumnVisibility,
    columnOptions
  };
}
