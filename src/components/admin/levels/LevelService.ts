import { supabase } from '@/integrations/supabase/client';
import { AdminLevelDetailed, AdminLevelBasic } from '@/types/adminLevel';

// Mapper function to convert from Supabase data format to our app's format
const mapToAdminLevel = (level: any): AdminLevelDetailed => {
  return {
    id: level.id,
    name: level.name,
    description: level.description,
    studentPermissions: level.student_permissions || [],
    teacherPermissions: level.teacher_permissions || [],
    adminPermissions: level.admin_permissions || [],
    leadPermissions: level.lead_permissions || [],
    coursePermissions: level.course_permissions || [],
    levelPermissions: level.level_permissions || [],
    eventsPermissions: level.events_permissions || [],
  };
};

// Mapper function to convert from our app's format to Supabase data format
const mapToSupabaseLevel = (level: Omit<AdminLevelDetailed, 'id'>): any => {
  return {
    name: level.name,
    description: level.description,
    student_permissions: level.studentPermissions,
    teacher_permissions: level.teacherPermissions,
    admin_permissions: level.adminPermissions,
    lead_permissions: level.leadPermissions,
    course_permissions: level.coursePermissions,
    level_permissions: level.levelPermissions,
    events_permissions: level.eventsPermissions,
  };
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

    return mapToAdminLevel(data);
  } catch (error) {
    console.error('Error creating admin level:', error);
    return null;
  }
};

// Export with different names for backward compatibility
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

export const updateAdminLevel = async (id: number, updates: Partial<Omit<AdminLevelDetailed, 'id'>>): Promise<AdminLevelDetailed | null> => {
  try {
    const supabaseUpdates = mapToSupabaseLevel(updates as Omit<AdminLevelDetailed, 'id'>);

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
