
import { supabase } from '@/integrations/supabase/client';
import { UserManagementUser } from '@/types/student';
import { hashPassword } from '@/integrations/supabase/client';
import { NewUserData } from './AddUserDialog';
import { mapDatabaseUserToUserModel } from '@/utils/userMappers';
// Import the updateAdminRole function and rename it to updateAdminLevel
import { updateAdminRole } from '@/components/superadmin/AdminRoleService';

export const fetchAllUsers = async (): Promise<UserManagementUser[]> => {
  const { data, error } = await supabase
    .from('custom_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapDatabaseUserToUserModel);
};

export const addUser = async (userData: NewUserData) => {
  console.log('Creating new user with data:', userData);
  
  const passwordHash = await hashPassword(userData.password);
  
  const userId = crypto.randomUUID();
  
  const dbUserData = {
    id: userId,
    email: userData.email.toLowerCase(),
    password_hash: passwordHash,
    first_name: userData.firstName,
    last_name: userData.lastName,
    role: userData.role,
    created_at: new Date().toISOString(),
    date_of_birth: userData.dateOfBirth || null,
    profile_photo: userData.profilePhoto || null,
    parent_name: userData.parentName || null,
    guardian_relation: userData.role === 'student' ? (userData.guardianRelation || null) : null,
    primary_phone: userData.primaryPhone || null,
    secondary_phone: userData.secondaryPhone || null,
    whatsapp_enabled: userData.whatsappEnabled || false,
    address: userData.address || null,
    id_proof: userData.idProof || null,
    admin_level_name: userData.role === 'admin' ? (userData.adminLevelName || "Limited View") : null
  };
  
  console.log('Inserting user data:', dbUserData);
  
  const { error } = await supabase
    .from('custom_users')
    .insert(dbUserData);

  if (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
  
  console.log('User created successfully');
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('custom_users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

// Create an updateAdminLevel function that updates the user's admin_level_name
export const updateAdminLevel = async (userId: string, levelName: string): Promise<void> => {
  console.log(`Updating admin level for user ${userId} to ${levelName}`);
  
  // Update the user's admin_level_name in custom_users table
  const { error } = await supabase
    .from('custom_users')
    .update({ admin_level_name: levelName })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};
