
import { AdminLevelDetailed } from '@/types/adminLevel';
import { supabase } from '@/integrations/supabase/client';
import { fetchAdminRoles, saveAdminLevel, deleteAdminRole } from '@/components/superadmin/AdminRoleService';

/**
 * Fetches all levels from the database
 */
export const fetchLevels = async (): Promise<AdminLevelDetailed[]> => {
  console.log('[LevelService] Fetching levels');
  try {
    const levels = await fetchAdminRoles();
    console.log('[LevelService] Fetched levels:', levels);
    return levels;
  } catch (error) {
    console.error('[LevelService] Error fetching levels:', error);
    throw error;
  }
};

/**
 * Creates a new level
 */
export const createLevel = async (level: Omit<AdminLevelDetailed, 'id'>): Promise<AdminLevelDetailed> => {
  console.log('[LevelService] Creating level:', level);
  try {
    const newLevel = await saveAdminLevel(level);
    console.log('[LevelService] Level created:', newLevel);
    return newLevel;
  } catch (error) {
    console.error('[LevelService] Error creating level:', error);
    throw error;
  }
};

/**
 * Updates an existing level
 */
export const updateLevel = async (id: number, level: Partial<AdminLevelDetailed>): Promise<AdminLevelDetailed> => {
  console.log('[LevelService] Updating level:', id, level);
  try {
    const updatedLevel = await saveAdminLevel({ ...level, id });
    console.log('[LevelService] Level updated:', updatedLevel);
    return updatedLevel;
  } catch (error) {
    console.error('[LevelService] Error updating level:', error);
    throw error;
  }
};

/**
 * Deletes a level
 */
export const deleteLevel = async (id: number): Promise<void> => {
  console.log('[LevelService] Deleting level:', id);
  try {
    await deleteAdminRole(id);
    console.log('[LevelService] Level deleted:', id);
  } catch (error) {
    console.error('[LevelService] Error deleting level:', error);
    throw error;
  }
};
