import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoTab from '@/components/admin/teacher-onboarding/PersonalInfoTab';
import EducationalInfoTab from '@/components/admin/teacher-onboarding/EducationalInfoTab';
import BankDetailsTab from '@/components/admin/teacher-onboarding/BankDetailsTab';
import ProfessionalInfoTab from '@/components/admin/teacher-onboarding/ProfessionalInfoTab';
import FormHeader from '@/components/admin/teacher-onboarding/form/FormHeader';
import TabButtons from '@/components/admin/teacher-onboarding/form/TabButtons';

interface Qualification {
  qualification: string;
  specialization: string;
  institution: string;
  graduationYear: string;
  additionalCertifications: string;
}

interface PreviousInstitute {
  name: string;
  location: string;
  years: string;
}

interface TeacherOnboardingFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  password: string;
  personalEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
  address: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  idProofPan: string;
  idProofAadhaar: string;
  profilePhoto: string;
  nationality: string;

  qualifications: Qualification[];

  teachingExperienceYears: number;
  primaryInstrument: string;
  primaryInstrumentLevel: string;
  secondaryInstrument: string;
  secondaryInstrumentLevel: string;
  previousInstitutes: PreviousInstitute[];
  classExperience: string[];
  performances: string;
  curriculumExperience: string;
  musicalProjects: string;
  comfortableGenres: string[];
  signatureStrength: string;
  performancePhoto: string;
  teachingPhilosophy: string;
  bio: string;
  instagramLink: string;
  youtubeLink: string;
  pay_slips_files: string[];
  relieving_letter: string;

  bank: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    bankProof: string;
  }
}

const TeacherOnboarding = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<TeacherOnboardingFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
    personalEmail: '',
    primaryPhone: '',
    secondaryPhone: '',
    address: '',
    permanentAddress: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactNumber: '',
    idProofPan: '',
    idProofAadhaar: '',
    profilePhoto: '',
    nationality: '',

    qualifications: [
      {
        qualification: '',
        specialization: '',
        institution: '',
        graduationYear: '',
        additionalCertifications: ''
      }
    ],

    teachingExperienceYears: 0,
    primaryInstrument: '',
    primaryInstrumentLevel: '',
    secondaryInstrument: '',
    secondaryInstrumentLevel: '',
    previousInstitutes: [{ name: '', location: '', years: '' }],
    classExperience: [],
    performances: '',
    curriculumExperience: '',
    musicalProjects: '',
    comfortableGenres: [],
    signatureStrength: '',
    performancePhoto: '',
    teachingPhilosophy: '',
    bio: '',
    instagramLink: '',
    youtubeLink: '',
    pay_slips_files: [],
    relieving_letter: '',

    bank: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      bankProof: ''
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'bank') {
      setFormData(prev => ({
        ...prev,
        bank: {
          ...prev.bank,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleQualificationChange = (index: number, field: string, value: string) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        {
          qualification: '',
          specialization: '',
          institution: '',
          graduationYear: '',
          additionalCertifications: ''
        }
      ]
    }));
  };

  const removeQualification = (index) => {
    if (formData.qualifications.length <= 1) return;
    
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  const handleInstituteChange = (index: number, field: string, value: string) => {
    const updatedInstitutes = [...formData.previousInstitutes];
    updatedInstitutes[index] = {
      ...updatedInstitutes[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      previousInstitutes: updatedInstitutes
    }));
  };

  const addInstitute = () => {
    setFormData(prev => ({
      ...prev,
      previousInstitutes: [
        ...prev.previousInstitutes,
        { name: '', location: '', years: '' }
      ]
    }));
  };

  const removeInstitute = (index) => {
    if (formData.previousInstitutes.length <= 1) return;
    
    const updatedInstitutes = formData.previousInstitutes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      previousInstitutes: updatedInstitutes
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Submitting teacher registration data:', formData);
      
      toast({
        title: "Registration Successful",
        description: "Teacher account has been created successfully",
      });
      
    } catch (error) {
      console.error('Error registering teacher:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating the teacher account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <FormHeader />
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoTab formData={formData} handleInputChange={handleInputChange} />
            <TabButtons currentTab="personal" setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4">
            <EducationalInfoTab 
              formData={formData} 
              handleQualificationChange={handleQualificationChange}
              addQualification={addQualification}
              removeQualification={removeQualification}
            />
            <TabButtons currentTab="education" setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="professional" className="space-y-4">
            <ProfessionalInfoTab 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
              handleInstituteChange={handleInstituteChange}
              addInstitute={addInstitute}
              removeInstitute={removeInstitute}
            />
            <TabButtons currentTab="professional" setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-4">
            <BankDetailsTab formData={formData} handleInputChange={handleInputChange} />
            <TabButtons currentTab="bank" setActiveTab={setActiveTab} isLastTab />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default TeacherOnboarding;
