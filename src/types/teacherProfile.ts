
export interface QualificationData {
  qualification: string;
  specialization: string;
  institution: string;
  graduationYear: string;
  additionalCertifications: string;
  qualifyingCertificate: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  bankProof: string;
}

export interface TeacherProfileFormData {
  qualifications: QualificationData[];
  previousInstitutes: any[];
  classExperience: string[];
  bank: BankDetails;
  teachingExperienceYears?: number;
  primaryInstrument?: string;
  primaryInstrumentLevel?: string;
  secondaryInstrument?: string;
  secondaryInstrumentLevel?: string;
  performances?: string;
  curriculumExperience?: string;
  musicalProjects?: string;
  teachingPhilosophy?: string;
  bio?: string;
  comfortableGenres?: string[];
}
