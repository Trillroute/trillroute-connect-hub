
import { supabase } from '@/integrations/supabase/client';
import { NewUserData } from './AddUserDialog';
import { UserManagementUser } from '@/types/student';
import { mapDatabaseUserToUserModel } from '@/utils/userMappers';

export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('custom_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    return data.map(mapDatabaseUserToUserModel) as UserManagementUser[];
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    throw error;
  }
};

export const fetchAllAdmins = async () => {
  try {
    const { data, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch administrators');
    }

    return data.map(mapDatabaseUserToUserModel) as UserManagementUser[];
  } catch (error) {
    console.error('Error in fetchAllAdmins:', error);
    throw error;
  }
};

export const addUser = async (userData: NewUserData) => {
  try {
    // Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        },
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    // Create the user in custom_users table
    const { error: dbError } = await supabase.from('custom_users').insert({
      id: authData.user.id,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role,
      admin_level_name: userData.role === 'admin' ? (userData.adminLevelName || 'Limited View') : null,
      password_hash: 'placeholder_hash' // Add this required field with a placeholder
    });

    if (dbError) {
      console.error('Error creating user in database:', dbError);
      throw new Error('Failed to create user record');
    }

    return { id: authData.user.id };
  } catch (error) {
    console.error('Error in addUser:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Delete from auth and the database cascade will handle the rest
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};

export const updateAdminLevel = async (userId: string, levelName: string) => {
  try {
    const { error } = await supabase
      .from('custom_users')
      .update({ admin_level_name: levelName })
      .eq('id', userId);

    if (error) {
      console.error('Error updating admin level:', error);
      throw new Error('Failed to update admin permission level');
    }

    return true;
  } catch (error) {
    console.error('Error in updateAdminLevel:', error);
    throw error;
  }
};
