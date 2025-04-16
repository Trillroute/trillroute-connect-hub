
import { UserManagementUser } from '@/types/student';

/**
 * Maps database user data to UserManagementUser interface
 */
export const mapDatabaseUserToUserModel = (user: any): UserManagementUser => ({
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
  adminLevel: undefined, // Keep for backward compatibility, but set to undefined
  adminRoleName: user.admin_level_name || (user.role === 'admin' ? "Limited View" : undefined)
});
