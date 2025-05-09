
import { supabase } from '@/integrations/supabase/client';
import { AdminLevelDetailed } from '@/types/adminLevel';

/**
 * Fetches all admin roles/levels from the database
 */
export const fetchAdminRoles = async (): Promise<AdminLevelDetailed[]> => {
  console.log('[AdminRoleService] Fetching admin roles from database');
  const { data, error } = await supabase
    .from('admin_levels')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('[AdminRoleService] Error fetching admin roles:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn('[AdminRoleService] No admin roles found in database');
    return [];
  }

  console.log('[AdminRoleService] Received admin roles from database:', data);

  return data.map(level => ({
    id: Number(level.id),
    name: level.name,
    description: level.description || '',
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
      : [],
    levelPermissions: Array.isArray(level.level_permissions)
      ? level.level_permissions
      : [],
    eventsPermissions: Array.isArray(level.events_permissions)
      ? level.events_permissions
      : [],
    classTypesPermissions: Array.isArray(level.class_types_permissions)
      ? level.class_types_permissions
      : [],
    userAvailabilityPermissions: Array.isArray(level.user_availability_permissions)
      ? level.user_availability_permissions
      : []
  }));
};

/**
 * Updates an admin's role level by name
 */
export const updateAdminLevel = async (userId: string, levelName: string): Promise<void> => {
  console.log(`[AdminRoleService] Updating admin level for user ${userId} to ${levelName}`);
  
  // First fetch the user to ensure they are an admin
  const { data: user, error: userError } = await supabase
    .from('custom_users')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error('[AdminRoleService] Error fetching user:', userError);
    throw new Error('User not found');
  }
  
  if (user.role !== 'admin') {
    console.error('[AdminRoleService] Cannot update admin level for non-admin user');
    throw new Error('User is not an admin');
  }
  
  // Now update the admin level
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

/**
 * Creates or updates an admin level in the database
 */
export const saveAdminLevel = async (level: Partial<AdminLevelDetailed>): Promise<AdminLevelDetailed> => {
  console.log('[AdminRoleService] Saving admin level:', level);
  
  // Map our frontend model to database column names
  const dbLevel = {
    id: level.id,
    name: level.name,
    description: level.description,
    student_permissions: level.studentPermissions,
    teacher_permissions: level.teacherPermissions,
    admin_permissions: level.adminPermissions,
    lead_permissions: level.leadPermissions,
    course_permissions: level.coursePermissions,
    level_permissions: level.levelPermissions,
    events_permissions: level.eventsPermissions,
    class_types_permissions: level.classTypesPermissions,
    user_availability_permissions: level.userAvailabilityPermissions
  };
  
  // Check if we're updating an existing level or creating a new one
  if (level.id) {
    // Update existing level
    const { data, error } = await supabase
      .from('admin_levels')
      .update(dbLevel)
      .eq('id', level.id)
      .select('*')
      .single();
      
    if (error) {
      console.error('[AdminRoleService] Error updating admin level:', error);
      throw error;
    }
    
    return await fetchAdminLevelById(level.id);
  } else {
    // Create new level
    // First get the max id and increment by 1
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('admin_levels')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
      
    if (maxIdError) {
      console.error('[AdminRoleService] Error fetching max id:', maxIdError);
      throw maxIdError;
    }
    
    const nextId = (maxIdData && maxIdData.length > 0) ? maxIdData[0].id + 1 : 1;
    dbLevel.id = nextId;
    
    const { data, error } = await supabase
      .from('admin_levels')
      .insert(dbLevel)
      .select('*')
      .single();
      
    if (error) {
      console.error('[AdminRoleService] Error creating admin level:', error);
      throw error;
    }
    
    return await fetchAdminLevelById(nextId);
  }
};

/**
 * Fetches a single admin level by ID
 */
export const fetchAdminLevelById = async (id: number): Promise<AdminLevelDetailed> => {
  console.log(`[AdminRoleService] Fetching admin level by id: ${id}`);
  const { data, error } = await supabase
    .from('admin_levels')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('[AdminRoleService] Error fetching admin level:', error);
    throw error;
  }
  
  return {
    id: Number(data.id),
    name: data.name,
    description: data.description || '',
    studentPermissions: Array.isArray(data.student_permissions) ? data.student_permissions : [],
    teacherPermissions: Array.isArray(data.teacher_permissions) ? data.teacher_permissions : [],
    adminPermissions: Array.isArray(data.admin_permissions) ? data.admin_permissions : [],
    leadPermissions: Array.isArray(data.lead_permissions) ? data.lead_permissions : [],
    coursePermissions: Array.isArray(data.course_permissions) ? data.course_permissions : [],
    levelPermissions: Array.isArray(data.level_permissions) ? data.level_permissions : [],
    eventsPermissions: Array.isArray(data.events_permissions) ? data.events_permissions : [],
    classTypesPermissions: Array.isArray(data.class_types_permissions) ? data.class_types_permissions : [],
    userAvailabilityPermissions: Array.isArray(data.user_availability_permissions) ? data.user_availability_permissions : []
  };
};

/**
 * Deletes an admin level by ID
 */
export const deleteAdminLevel = async (id: number): Promise<void> => {
  console.log(`[AdminRoleService] Deleting admin level: ${id}`);
  
  const { error } = await supabase
    .from('admin_levels')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('[AdminRoleService] Error deleting admin level:', error);
    throw error;
  }
  
  console.log(`[AdminRoleService] Successfully deleted admin level: ${id}`);
};

/**
 * Creates default admin levels in the database if none exist
 */
export const createDefaultAdminLevels = async (): Promise<AdminLevelDetailed[]> => {
  console.log('[AdminRoleService] Checking if default admin levels need to be created');
  
  // Check if there are any admin levels
  const { data, error } = await supabase
    .from('admin_levels')
    .select('count', { count: 'exact', head: true });
    
  if (error) {
    console.error('[AdminRoleService] Error checking admin levels count:', error);
    throw error;
  }
  
  // If we have admin levels, don't create defaults
  if (data && data.count && data.count > 0) {
    console.log('[AdminRoleService] Admin levels already exist, not creating defaults');
    return fetchAdminRoles();
  }
  
  console.log('[AdminRoleService] No admin levels found, creating defaults');
  
  // Default admin levels
  const defaultLevels = [
    {
      id: 10,
      name: "Limited View",
      description: "View-only administrator",
      student_permissions: ["view"],
      teacher_permissions: ["view"],
      admin_permissions: [],
      lead_permissions: [],
      course_permissions: ["view"],
      level_permissions: []
    },
    {
      id: 50,
      name: "Standard Admin",
      description: "Regular administrator permissions",
      student_permissions: ["view", "add", "edit"],
      teacher_permissions: ["view", "add"],
      admin_permissions: [],
      lead_permissions: ["view", "add", "edit"],
      course_permissions: ["view", "edit"],
      level_permissions: ["view"]
    },
    {
      id: 90,
      name: "Full Access",
      description: "Complete administrative access",
      student_permissions: ["view", "add", "edit", "delete"],
      teacher_permissions: ["view", "add", "edit", "delete"],
      admin_permissions: ["view"],
      lead_permissions: ["view", "add", "edit", "delete"],
      course_permissions: ["view", "add", "edit", "delete"],
      level_permissions: ["view", "add", "edit", "delete"]
    }
  ];
  
  // Insert the default levels
  const { error: insertError } = await supabase
    .from('admin_levels')
    .insert(defaultLevels);
    
  if (insertError) {
    console.error('[AdminRoleService] Error creating default admin levels:', insertError);
    throw insertError;
  }
  
  console.log('[AdminRoleService] Successfully created default admin levels');
  return fetchAdminRoles();
};
