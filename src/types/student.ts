
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
  createdAt: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  parentName?: string;
  guardianRelation?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  whatsappEnabled?: boolean;
  address?: string;
  idProof?: string;
}
