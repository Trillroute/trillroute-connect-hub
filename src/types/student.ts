
export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  parentName?: string;
  guardianRelation?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  whatsappEnabled?: boolean;
  email: string;
  address?: string;
  idProof?: string;
}

// Interface that defines the structure we'll use when storing student profiles
// This matches the custom_users table directly
export interface StudentProfileData {
  user_id: string;
  date_of_birth?: string;
  profile_photo?: string;
  parent_name?: string;
  guardian_relation?: string;
  primary_phone?: string;
  secondary_phone?: string;
  whatsapp_enabled?: boolean;
  address?: string;
  id_proof?: string;
}

export interface UserManagementUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}
