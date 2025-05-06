
import { useState, useEffect, useCallback } from 'react';
import { AdminLevelDetailed } from '@/types/adminLevel';
import { fetchLevels, deleteLevel as deleteLevelApi, createLevel, updateLevel } from '../LevelService';
import { useToast } from '@/hooks/use-toast';
import { Level } from '../LevelTable';
import { updateCachedAdminRoles } from '@/utils/permissions/permissionCache';

export function useLevelData() {
  const [levels, setLevels] = useState<AdminLevelDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch levels
  const loadLevels = useCallback(async () => {
    setIsLoading(true);
    try {
      const levelsData = await fetchLevels();
      setLevels(levelsData);
      
      // Update cached roles for permission system
      updateCachedAdminRoles(levelsData);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch admin levels. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load levels on mount
  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  // Handlers for CRUD operations
  const handleCreateLevel = async (levelData: Omit<AdminLevelDetailed, 'id'>) => {
    setIsLoading(true);
    try {
      await createLevel(levelData);
      toast({
        title: 'Success',
        description: 'Admin level created successfully',
      });
      loadLevels();
      return true;
    } catch (error) {
      console.error('Error creating level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create admin level. Please try again.',
      });
      return false;
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
        description: 'Admin level updated successfully',
      });
      loadLevels();
      return true;
    } catch (error) {
      console.error('Error updating level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update admin level. Please try again.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLevel = async (level: AdminLevelDetailed | null) => {
    if (!level) return false;
    
    setIsLoading(true);
    try {
      await deleteLevelApi(level.id);
      toast({
        title: 'Success',
        description: 'Admin level deleted successfully',
      });
      loadLevels();
      return true;
    } catch (error) {
      console.error('Error deleting level:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete admin level. Please try again.',
      });
      return false;
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
        description: `${ids.length} admin levels deleted successfully`,
      });
      
      loadLevels();
      return true;
    } catch (error) {
      console.error('Error during bulk delete:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete some or all admin levels. Please try again.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Find AdminLevelDetailed by Level
  const findLevelById = (levelId: string): AdminLevelDetailed | null => {
    const adminLevel = levels.find(l => String(l.id) === levelId) || null;
    return adminLevel;
  };

  return {
    levels,
    isLoading,
    loadLevels,
    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleBulkDelete,
    findLevelById
  };
}
