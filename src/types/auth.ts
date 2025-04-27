
// Define user roles
export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin';

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dateOfBirth?: string;
  profilePhoto?: string;
  parentName?: string;
  guardianRelation?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  whatsappEnabled?: boolean;
  address?: string;
  idProof?: string;
  adminLevel?: number; // Kept for backward compatibility
  adminRoleName?: string; // Added adminRoleName property
  createdAt: string;
}

export interface CustomUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  date_of_birth?: string;
  profile_photo?: string;
  parent_name?: string;
  guardian_relation?: string;
  primary_phone?: string;
  secondary_phone?: string;
  whatsapp_enabled?: boolean;
  address?: string;
  id_proof?: string;
  admin_level?: number;
  admin_level_name?: string;
}

export interface StudentProfileData {
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

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole, additionalData?: StudentProfileData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  refreshSession: () => Promise<boolean>;
}
