import { supabase } from '@/integrations/supabase/client';
import { UserManagementUser } from '@/types/student';
import { hashPassword } from '@/integrations/supabase/client';
import { NewUserData } from './AddUserDialog';

export const fetchAllUsers = async (): Promise<UserManagementUser[]> => {
  const { data, error } = await supabase
    .from('custom_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((user) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    dateOfBirth: user.date_of_birth,
    profilePhoto: user.profile_photo,
    parentName: user.parent_name,
    guardianRelation: user.guardian_relation,
    primaryPhone: user.primary_phone,
    secondaryPhone: user.secondary_phone,
    whatsappEnabled: user.whatsapp_enabled,
    address: user.address,
    idProof: user.id_proof,
    adminLevel: undefined,
    adminRoleName: user.admin_level_name || (user.role === 'admin' ? "Limited View" : undefined)
  }));
};

export const addUser = async (userData: NewUserData) => {
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
    date_of_birth: userData.dateOfBirth,
    profile_photo: userData.profilePhoto,
    parent_name: userData.parentName,
    guardian_relation: userData.role === 'student' ? userData.guardianRelation : null,
    primary_phone: userData.primaryPhone,
    secondary_phone: userData.secondaryPhone,
    whatsapp_enabled: userData.whatsappEnabled,
    address: userData.address,
    id_proof: userData.idProof,
    admin_level_name: userData.role === 'admin' ? "Limited View" : null
  };
  
  const { error } = await supabase
    .from('custom_users')
    .insert(dbUserData);

  if (error) {
    throw error;
  }
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

export const updateAdminLevel = async (userId: string, levelName: string) => {
  const { error } = await supabase
    .from('custom_users')
    .update({ admin_level_name: levelName })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};
