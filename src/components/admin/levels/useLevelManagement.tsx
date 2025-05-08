
import { useLevelData } from './hooks/useLevelData';
import { useLevelSelection } from './hooks/useLevelSelection';
import { useLevelDisplay } from './hooks/useLevelDisplay';
import { useLevelDialogs } from './hooks/useLevelDialogs';
import { useLevelPermissions } from './hooks/useLevelPermissions';
import { AdminLevelDetailed } from '@/types/adminLevel';

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
    openEditDialog,
    openDeleteDialog,
    openViewPermissionsDialog,
    openEditPermissionsDialog,
    resetDialogStates
  } = useLevelDialogs();
  
  const {
    effectiveCanAdd,
    effectiveCanEdit,
    effectiveCanDelete
  } = useLevelPermissions(canAddLevel, canEditLevel, canDeleteLevel);

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
    toggleColumnVisibility,
    columnOptions,
    findLevelById,
    clearSelection,
    resetDialogStates
  };
}
