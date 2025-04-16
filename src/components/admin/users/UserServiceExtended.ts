
import { supabase } from '@/integrations/supabase/client';
import { UserManagementUser } from '@/types/student';
import { fetchAllUsers, addUser, deleteUser, updateAdminLevel } from './UserService';

// Export the existing functions
export { fetchAllUsers, addUser, deleteUser, updateAdminLevel };

// Add a new function to update user data
export const updateUser = async (userId: string, userData: Partial<UserManagementUser>): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const updateData: Record<string, any> = {};
  
  if (userData.firstName !== undefined) updateData.first_name = userData.firstName;
  if (userData.lastName !== undefined) updateData.last_name = userData.lastName;
  if (userData.email !== undefined) updateData.email = userData.email.toLowerCase();
  if (userData.primaryPhone !== undefined) updateData.primary_phone = userData.primaryPhone;
  if (userData.secondaryPhone !== undefined) updateData.secondary_phone = userData.secondaryPhone;
  if (userData.address !== undefined) updateData.address = userData.address;

  const { error } = await supabase
    .from('custom_users')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user:', error);
    throw new Error(error.message);
  }
};
