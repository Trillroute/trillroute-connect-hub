
import { supabase } from '@/integrations/supabase/client';
import { AdminLevelDetailed, AdminLevelBasic } from '@/types/adminLevel';
import { clearPermissionCache } from '@/utils/permissions/permissionCache';

// Mapper function to convert from Supabase data format to our app's format
const mapToAdminLevel = (level: any): AdminLevelDetailed => {
  return {
    id: level.id,
    name: level.name,
    description: level.description || '',
    studentPermissions: level.student_permissions || [],
    teacherPermissions: level.teacher_permissions || [],
    adminPermissions: level.admin_permissions || [],
    leadPermissions: level.lead_permissions || [],
    coursePermissions: level.course_permissions || [],
    levelPermissions: level.level_permissions || [],
  };
};

// Mapper function to convert from our app's format to Supabase data format
const mapToSupabaseLevel = (level: Partial<AdminLevelDetailed>): any => {
  const result: any = {};
  
  // Only include fields that are defined
  if (level.name !== undefined) result.name = level.name;
  if (level.description !== undefined) result.description = level.description;
  if (level.studentPermissions !== undefined) result.student_permissions = level.studentPermissions;
  if (level.teacherPermissions !== undefined) result.teacher_permissions = level.teacherPermissions;
  if (level.adminPermissions !== undefined) result.admin_permissions = level.adminPermissions;
  if (level.leadPermissions !== undefined) result.lead_permissions = level.leadPermissions;
  if (level.coursePermissions !== undefined) result.course_permissions = level.coursePermissions;
  if (level.levelPermissions !== undefined) result.level_permissions = level.levelPermissions;
  
  return result;
};

export const createAdminLevel = async (level: Omit<AdminLevelDetailed, 'id'>): Promise<AdminLevelDetailed | null> => {
  try {
    const supabaseLevel = mapToSupabaseLevel(level);
    
    const { data, error } = await supabase
      .from('admin_levels')
      .insert(supabaseLevel)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating admin level:', error);
      return null;
    }
    
    // Clear permission cache after creating a new level
    clearPermissionCache();

    return mapToAdminLevel(data);
  } catch (error) {
    console.error('Error creating admin level:', error);
    return null;
  }
};

export const fetchAdminLevels = async (): Promise<AdminLevelDetailed[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_levels')
      .select('*');

    if (error) {
      console.error('Error fetching admin levels:', error);
      return [];
    }

    return data.map(mapToAdminLevel);
  } catch (error) {
    console.error('Error fetching admin levels:', error);
    return [];
  }
};

export const updateAdminLevel = async (id: number, updates: Partial<AdminLevelDetailed>): Promise<AdminLevelDetailed | null> => {
  try {
    const supabaseUpdates = mapToSupabaseLevel(updates);

    const { data, error } = await supabase
      .from('admin_levels')
      .update(supabaseUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating admin level:', error);
      return null;
    }
    
    // Clear permission cache after updating a level
    clearPermissionCache();

    return mapToAdminLevel(data);
  } catch (error) {
    console.error('Error updating admin level:', error);
    return null;
  }
};

export const deleteAdminLevel = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_levels')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting admin level:', error);
      return false;
    }
    
    // Clear permission cache after deleting a level
    clearPermissionCache();

    return true;
  } catch (error) {
    console.error('Error deleting admin level:', error);
    return false;
  }
};

// Add the function aliases needed by LevelManagement.tsx
export const fetchLevels = fetchAdminLevels;
export const createLevel = createAdminLevel;
export const updateLevel = updateAdminLevel;
export const deleteLevel = deleteAdminLevel;
