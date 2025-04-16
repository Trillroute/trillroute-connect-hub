
import { supabase } from '@/integrations/supabase/client';
import { AdminLevel } from '@/utils/adminPermissions';

/**
 * Fetches all admin roles/levels from the database
 */
export const fetchAdminRoles = async (): Promise<AdminLevel[]> => {
  console.log('[AdminRoleService] Fetching admin roles from database');
  const { data, error } = await supabase
    .from('admin_levels')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('[AdminRoleService] Error fetching admin roles:', error);
    throw error;
  }

  console.log('[AdminRoleService] Received admin roles from database:', data);

  return data.map(level => ({
    name: level.name,
    description: level.description,
    studentPermissions: Array.isArray(level.student_permissions) 
      ? level.student_permissions 
      : [],
    teacherPermissions: Array.isArray(level.teacher_permissions) 
      ? level.teacher_permissions 
      : [],
    adminPermissions: Array.isArray(level.admin_permissions) 
      ? level.admin_permissions 
      : [],
    leadPermissions: Array.isArray(level.lead_permissions) 
      ? level.lead_permissions 
      : [],
    coursePermissions: Array.isArray(level.course_permissions) 
      ? level.course_permissions 
      : []
  }));
};

/**
 * Updates an admin's role level by name
 */
export const updateAdminLevel = async (userId: string, levelName: string): Promise<void> => {
  console.log(`[AdminRoleService] Updating admin level for user ${userId} to ${levelName}`);
  const { error } = await supabase
    .from('custom_users')
    .update({ admin_level_name: levelName })
    .eq('id', userId);

  if (error) {
    console.error('[AdminRoleService] Error updating admin level:', error);
    throw error;
  }
  
  console.log(`[AdminRoleService] Successfully updated admin level for user ${userId}`);
};
