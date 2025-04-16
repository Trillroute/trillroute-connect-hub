
import { supabase } from '@/integrations/supabase/client';
import { UserManagementUser } from '@/types/student';

export const fetchAdmins = async (): Promise<UserManagementUser[]> => {
  const { data, error } = await supabase
    .from('custom_users')
    .select('*')
    .eq('role', 'admin')
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
    adminLevel: user.admin_level
  }));
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
