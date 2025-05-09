
import { AdminLevel, AdminRoleExport } from '@/utils/permissions/types';
import { supabase } from '@/integrations/supabase/client';
import { AdminLevelDetailed } from '@/types/adminLevel';

// Default admin roles to use if the database is empty
export const DEFAULT_ADMIN_ROLES: AdminLevelDetailed[] = [
  {
    id: 1,
    name: 'Student Manager',
    description: 'Can manage student data',
    level: 1,
    studentPermissions: ['VIEW_STUDENTS', 'ADD_STUDENTS', 'EDIT_STUDENTS', 'DELETE_STUDENTS'],
    teacherPermissions: ['VIEW_TEACHERS'],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ['VIEW_COURSES'],
    levelPermissions: [],
    eventsPermissions: [],
    classTypesPermissions: [],
    userAvailabilityPermissions: []
  },
  {
    id: 2,
    name: 'Teacher Manager',
    description: 'Can manage teacher data',
    level: 2,
    studentPermissions: ['VIEW_STUDENTS'],
    teacherPermissions: ['VIEW_TEACHERS', 'ADD_TEACHERS', 'EDIT_TEACHERS', 'DELETE_TEACHERS'],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ['VIEW_COURSES'],
    levelPermissions: [],
    eventsPermissions: [],
    classTypesPermissions: [],
    userAvailabilityPermissions: []
  },
  {
    id: 3,
    name: 'Course Manager',
    description: 'Can manage courses',
    level: 3,
    studentPermissions: ['VIEW_STUDENTS'],
    teacherPermissions: ['VIEW_TEACHERS'],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ['VIEW_COURSES', 'ADD_COURSES', 'EDIT_COURSES', 'DELETE_COURSES'],
    levelPermissions: [],
    eventsPermissions: [],
    classTypesPermissions: [],
    userAvailabilityPermissions: []
  },
  {
    id: 4,
    name: 'Admin Manager',
    description: 'Can manage other admins',
    level: 4,
    studentPermissions: ['VIEW_STUDENTS', 'ADD_STUDENTS', 'EDIT_STUDENTS', 'DELETE_STUDENTS'],
    teacherPermissions: ['VIEW_TEACHERS', 'ADD_TEACHERS', 'EDIT_TEACHERS', 'DELETE_TEACHERS'],
    adminPermissions: ['VIEW_ADMINS', 'ADD_ADMINS', 'EDIT_ADMINS', 'DELETE_ADMINS'],
    leadPermissions: ['VIEW_LEADS', 'ADD_LEADS', 'EDIT_LEADS', 'DELETE_LEADS'],
    coursePermissions: ['VIEW_COURSES', 'ADD_COURSES', 'EDIT_COURSES', 'DELETE_COURSES'],
    levelPermissions: ['VIEW_LEVELS'],
    eventsPermissions: ['VIEW_EVENTS', 'ADD_EVENTS', 'EDIT_EVENTS', 'DELETE_EVENTS'],
    classTypesPermissions: ['VIEW_CLASS_TYPES', 'ADD_CLASS_TYPES', 'EDIT_CLASS_TYPES', 'DELETE_CLASS_TYPES'],
    userAvailabilityPermissions: ['VIEW_USER_AVAILABILITY', 'ADD_USER_AVAILABILITY', 'EDIT_USER_AVAILABILITY', 'DELETE_USER_AVAILABILITY']
  }
];

/**
 * Transforms database admin role data to AdminLevelDetailed format
 */
const transformDbRoleToAdminLevelDetailed = (dbRole: any): AdminLevelDetailed => {
  try {
    return {
      id: dbRole.id,
      name: dbRole.name || '',
      description: dbRole.description || '',
      level: dbRole.level || dbRole.id,
      studentPermissions: dbRole.student_permissions || [],
      teacherPermissions: dbRole.teacher_permissions || [],
      adminPermissions: dbRole.admin_permissions || [],
      leadPermissions: dbRole.lead_permissions || [],
      coursePermissions: dbRole.course_permissions || [],
      levelPermissions: dbRole.level_permissions || [],
      eventsPermissions: dbRole.events_permissions || [],
      classTypesPermissions: dbRole.class_types_permissions || [],
      userAvailabilityPermissions: dbRole.user_availability_permissions || []
    };
  } catch (error) {
    console.error('Error transforming admin role:', error);
    return {
      id: 0,
      name: 'Error',
      description: 'Error loading role',
      level: 0,
      studentPermissions: [],
      teacherPermissions: [],
      adminPermissions: [],
      leadPermissions: [],
      coursePermissions: [],
      levelPermissions: [],
      eventsPermissions: [],
      classTypesPermissions: [],
      userAvailabilityPermissions: []
    };
  }
};

/**
 * Fetches all admin roles from the database
 * @returns {Promise<AdminLevelDetailed[]>} Array of admin roles
 */
export const fetchAdminRoles = async (): Promise<AdminLevelDetailed[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      console.error('Error fetching admin roles:', error);
      return DEFAULT_ADMIN_ROLES;
    }

    if (!data || data.length === 0) {
      console.log('No admin roles found, using defaults');
      return DEFAULT_ADMIN_ROLES;
    }

    // Transform the data to AdminLevelDetailed format
    return data.map(transformDbRoleToAdminLevelDetailed);
  } catch (error) {
    console.error('Error in fetchAdminRoles:', error);
    return DEFAULT_ADMIN_ROLES;
  }
};

/**
 * Fetches a specific admin role by ID
 */
export const fetchAdminRoleById = async (id: number): Promise<AdminLevelDetailed | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching admin role:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return transformDbRoleToAdminLevelDetailed(data);
  } catch (error) {
    console.error('Error in fetchAdminRoleById:', error);
    return null;
  }
};

/**
 * Creates a new admin role
 */
export const createAdminRole = async (role: AdminLevelDetailed): Promise<AdminLevelDetailed | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .insert({
        name: role.name,
        description: role.description,
        level: role.level,
        student_permissions: role.studentPermissions,
        teacher_permissions: role.teacherPermissions,
        admin_permissions: role.adminPermissions,
        lead_permissions: role.leadPermissions,
        course_permissions: role.coursePermissions,
        level_permissions: role.levelPermissions,
        events_permissions: role.eventsPermissions,
        class_types_permissions: role.classTypesPermissions,
        user_availability_permissions: role.userAvailabilityPermissions
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin role:', error);
      return null;
    }

    return transformDbRoleToAdminLevelDetailed(data);
  } catch (error) {
    console.error('Error in createAdminRole:', error);
    return null;
  }
};

/**
 * Updates an existing admin role
 */
export const updateAdminRole = async (role: AdminLevelDetailed): Promise<AdminLevelDetailed | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .update({
        name: role.name,
        description: role.description,
        level: role.level,
        student_permissions: role.studentPermissions,
        teacher_permissions: role.teacherPermissions,
        admin_permissions: role.adminPermissions,
        lead_permissions: role.leadPermissions,
        course_permissions: role.coursePermissions,
        level_permissions: role.levelPermissions,
        events_permissions: role.eventsPermissions,
        class_types_permissions: role.classTypesPermissions,
        user_availability_permissions: role.userAvailabilityPermissions
      })
      .eq('id', role.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin role:', error);
      return null;
    }

    return transformDbRoleToAdminLevelDetailed(data);
  } catch (error) {
    console.error('Error in updateAdminRole:', error);
    return null;
  }
};

/**
 * Deletes an admin role
 */
export const deleteAdminRole = async (id: number): Promise<boolean> => {
  try {
    // Check if this is the only admin role
    const { data: countData, error: countError } = await supabase
      .from('admin_roles')
      .select('count');

    if (countError) {
      console.error('Error counting admin roles:', countError);
      return false;
    }

    // Parse the count result
    const count = countData.length > 0 ? Number(countData[0].count) : 0;

    // Don't allow deleting the last admin role
    if (count <= 1) {
      console.error('Cannot delete the last admin role');
      return false;
    }

    const { error } = await supabase
      .from('admin_roles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting admin role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAdminRole:', error);
    return false;
  }
};

/**
 * Exports admin roles to JSON format
 */
export const exportAdminRolesToJson = async (): Promise<AdminRoleExport[]> => {
  try {
    const roles = await fetchAdminRoles();
    
    return roles.map(role => ({
      roleName: role.name,
      permissions: {
        students: role.studentPermissions,
        teachers: role.teacherPermissions,
        admins: role.adminPermissions,
        leads: role.leadPermissions,
        courses: role.coursePermissions,
        levels: role.levelPermissions,
        events: role.eventsPermissions,
        classTypes: role.classTypesPermissions,
        userAvailability: role.userAvailabilityPermissions
      }
    }));
  } catch (error) {
    console.error('Error exporting admin roles:', error);
    return [];
  }
};

/**
 * Imports admin roles from JSON format
 */
export const importAdminRolesFromJson = async (roles: AdminRoleExport[]): Promise<boolean> => {
  try {
    // First delete all existing roles
    const { error: deleteError } = await supabase
      .from('admin_roles')
      .delete()
      .neq('id', 0); // Delete all rows

    if (deleteError) {
      console.error('Error deleting existing admin roles:', deleteError);
      return false;
    }

    // Then insert the new roles
    for (const role of roles) {
      const { error: insertError } = await supabase
        .from('admin_roles')
        .insert({
          name: role.roleName,
          description: '',
          student_permissions: role.permissions.students,
          teacher_permissions: role.permissions.teachers,
          admin_permissions: role.permissions.admins,
          lead_permissions: role.permissions.leads,
          course_permissions: role.permissions.courses,
          level_permissions: role.permissions.levels,
          events_permissions: role.permissions.events,
          class_types_permissions: role.permissions.classTypes,
          user_availability_permissions: role.permissions.userAvailability
        });

      if (insertError) {
        console.error('Error inserting admin role:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error importing admin roles:', error);
    return false;
  }
};
