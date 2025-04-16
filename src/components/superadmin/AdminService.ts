
import { supabase } from '@/integrations/supabase/client';
import { UserManagementUser } from '@/types/student';
import { mapDatabaseUserToUserModel } from '@/utils/userMappers';
import { fetchAdminRoles as fetchAdminRolesDb } from './AdminRoleService';

export const fetchAdmins = async (): Promise<UserManagementUser[]> => {
  const { data, error } = await supabase
    .from('custom_users')
    .select('*')
    .eq('role', 'admin')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapDatabaseUserToUserModel);
};

export const updateUserRole = async (userId: string, newRole: 'admin' | 'teacher'): Promise<void> => {
  const { error } = await supabase
    .from('custom_users')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('custom_users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

// Export the fetchAdminLevels function for backward compatibility
export const fetchAdminLevels = fetchAdminRolesDb;
export const fetchAdminRoles = fetchAdminRolesDb;
