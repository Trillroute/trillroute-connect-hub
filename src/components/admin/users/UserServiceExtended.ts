
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
  
  // Basic info
  if (userData.firstName !== undefined) updateData.first_name = userData.firstName;
  if (userData.lastName !== undefined) updateData.last_name = userData.lastName;
  if (userData.email !== undefined) updateData.email = userData.email.toLowerCase();
  
  // Contact information
  if (userData.primaryPhone !== undefined) updateData.primary_phone = userData.primaryPhone;
  if (userData.secondaryPhone !== undefined) updateData.secondary_phone = userData.secondaryPhone;
  if (userData.address !== undefined) updateData.address = userData.address;
  if (userData.whatsappEnabled !== undefined) updateData.whatsapp_enabled = userData.whatsappEnabled;
  
  // Personal information
  if (userData.dateOfBirth !== undefined) updateData.date_of_birth = userData.dateOfBirth;
  if (userData.gender !== undefined) updateData.gender = userData.gender;
  if (userData.nationality !== undefined) updateData.nationality = userData.nationality;
  
  // Guardian information (for students)
  if (userData.parentName !== undefined) updateData.parent_name = userData.parentName;
  if (userData.guardianRelation !== undefined) updateData.guardian_relation = userData.guardianRelation;
  
  // Teacher-specific fields
  if (userData.personalEmail !== undefined) updateData.personal_email = userData.personalEmail;
  if (userData.permanentAddress !== undefined) updateData.permanent_address = userData.permanentAddress;
  
  // Emergency contact information
  if (userData.emergencyContactName !== undefined) updateData.emergency_contact_name = userData.emergencyContactName;
  if (userData.emergencyContactRelation !== undefined) updateData.emergency_contact_relation = userData.emergencyContactRelation;
  if (userData.emergencyContactNumber !== undefined) updateData.emergency_contact_number = userData.emergencyContactNumber;

  const { error } = await supabase
    .from('custom_users')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user:', error);
    throw new Error(error.message);
  }
};
