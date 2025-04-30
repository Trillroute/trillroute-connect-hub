
import { useLevelData } from './hooks/useLevelData';
import { useLevelSelection } from './hooks/useLevelSelection';
import { useLevelDisplay } from './hooks/useLevelDisplay';
import { useLevelDialogs } from './hooks/useLevelDialogs';
import { useLevelPermissions } from './hooks/useLevelPermissions';
import { Level } from './LevelTable';

export function useLevelManagement(
  canAddLevel: boolean = true,
  canEditLevel: boolean = true,
  canDeleteLevel: boolean = true
) {
  // Use the individual hooks
  const {
    levels,
    isLoading,
    loadLevels,
    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleBulkDelete,
    findLevelById
  } = useLevelData();
  
  const {
    selectedIds,
    setSelectedIds,
    clearSelection
  } = useLevelSelection();
  
  const {
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumnVisibility,
    columnOptions
  } = useLevelDisplay();
  
  const {
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
    resetDialogStates
  } = useLevelDialogs();
  
  const {
    effectiveCanAdd,
    effectiveCanEdit,
    effectiveCanDelete
  } = useLevelPermissions(canAddLevel, canEditLevel, canDeleteLevel);

  // Handlers for passing Level objects to dialog functions
  const openEditDialog = (level: Level) => {
    const adminLevel = findLevelById(level.id);
    if (adminLevel) {
      setIsEditDialogOpen(true);
      setSelectedLevel(adminLevel);
    }
  };

  const openDeleteDialog = (level: Level) => {
    const adminLevel = findLevelById(level.id);
    if (adminLevel) {
      setIsDeleteDialogOpen(true);
      setSelectedLevel(adminLevel);
    }
  };

  const openViewPermissionsDialog = (level: Level) => {
    const adminLevel = findLevelById(level.id);
    if (adminLevel) {
      setIsViewPermissionsDialogOpen(true);
      setSelectedLevel(adminLevel);
    }
  };

  const openEditPermissionsDialog = (level: Level) => {
    const adminLevel = findLevelById(level.id);
    if (adminLevel) {
      setIsEditPermissionsDialogOpen(true);
      setSelectedLevel(adminLevel);
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
    handleDeleteLevel: () => handleDeleteLevel(selectedLevel),
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
  };
}
