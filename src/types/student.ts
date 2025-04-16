
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
