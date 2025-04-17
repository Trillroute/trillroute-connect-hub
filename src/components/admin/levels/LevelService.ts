
import { supabase } from '@/integrations/supabase/client';
import { AdminLevelBasic, AdminLevelDetailed } from '@/types/adminLevel';

export const fetchLevels = async (): Promise<AdminLevelDetailed[]> => {
  const { data, error } = await supabase
    .from('admin_levels')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('[LevelService] Error fetching admin levels:', error);
    throw error;
  }

  return data.map(level => ({
    id: level.id,
    name: level.name,
    description: level.description || '',
    studentPermissions: Array.isArray(level.student_permissions) ? level.student_permissions : [],
    teacherPermissions: Array.isArray(level.teacher_permissions) ? level.teacher_permissions : [],
    adminPermissions: Array.isArray(level.admin_permissions) ? level.admin_permissions : [],
    leadPermissions: Array.isArray(level.lead_permissions) ? level.lead_permissions : [],
    coursePermissions: Array.isArray(level.course_permissions) ? level.course_permissions : [],
    levelPermissions: Array.isArray(level.level_permissions) ? level.level_permissions : []
  }));
};

export const addLevel = async (levelData: Omit<AdminLevelDetailed, 'id'>): Promise<AdminLevelDetailed> => {
  const { data, error } = await supabase
    .from('admin_levels')
    .insert({
      name: levelData.name,
      description: levelData.description,
      student_permissions: levelData.studentPermissions,
      teacher_permissions: levelData.teacherPermissions,
      admin_permissions: levelData.adminPermissions,
      lead_permissions: levelData.leadPermissions,
      course_permissions: levelData.coursePermissions,
      level_permissions: levelData.levelPermissions
    })
    .select()
    .single();

  if (error) {
    console.error('[LevelService] Error adding admin level:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    studentPermissions: data.student_permissions || [],
    teacherPermissions: data.teacher_permissions || [],
    adminPermissions: data.admin_permissions || [],
    leadPermissions: data.lead_permissions || [],
    coursePermissions: data.course_permissions || [],
    levelPermissions: data.level_permissions || []
  };
};

export const updateLevel = async (id: number, levelData: Partial<AdminLevelDetailed>): Promise<void> => {
  const updateData: Record<string, any> = {};
  
  if (levelData.name !== undefined) updateData.name = levelData.name;
  if (levelData.description !== undefined) updateData.description = levelData.description;
  if (levelData.studentPermissions !== undefined) updateData.student_permissions = levelData.studentPermissions;
  if (levelData.teacherPermissions !== undefined) updateData.teacher_permissions = levelData.teacherPermissions;
  if (levelData.adminPermissions !== undefined) updateData.admin_permissions = levelData.adminPermissions;
  if (levelData.leadPermissions !== undefined) updateData.lead_permissions = levelData.leadPermissions;
  if (levelData.coursePermissions !== undefined) updateData.course_permissions = levelData.coursePermissions;
  if (levelData.levelPermissions !== undefined) updateData.level_permissions = levelData.levelPermissions;

  const { error } = await supabase
    .from('admin_levels')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('[LevelService] Error updating admin level:', error);
    throw error;
  }
};

export const deleteLevel = async (id: number): Promise<void> => {
  // First check if there are any users using this level
  const { data: users, error: usersError } = await supabase
    .from('custom_users')
    .select('id')
    .eq('admin_level_name', id.toString())
    .limit(1);

  if (usersError) {
    console.error('[LevelService] Error checking if level is in use:', usersError);
    throw usersError;
  }

  if (users && users.length > 0) {
    throw new Error('Cannot delete level because it is assigned to one or more users');
  }

  const { error } = await supabase
    .from('admin_levels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[LevelService] Error deleting admin level:', error);
    throw error;
  }
};
