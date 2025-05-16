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

export interface UserManagementUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt?: string;
  parentName?: string;
  guardianRelation?: string;
  idProof?: string;
  adminLevel?: number;
  adminRoleName?: string;
  whatsappEnabled?: boolean;
  
  // Additional fields for teachers
  gender?: string;
  personalEmail?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  nationality?: string;
}
