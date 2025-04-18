import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeacherProfileFormData } from '@/types/teacherProfile';
import { calculateProfileProgress } from '@/utils/teacherProfileProgress';
import { fetchTeacherProfileData } from '@/utils/teacherProfileData';

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<TeacherProfileFormData>({
    qualifications: [{ 
      qualification: '', 
      specialization: '', 
      institution: '', 
      graduationYear: '', 
      additionalCertifications: '',
      qualifyingCertificate: '' 
    }],
    previousInstitutes: [],
    classExperience: [],
    bank: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      bankProof: '',
    }
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      
      const profileData = await fetchTeacherProfileData(user.id);
      setFormData(profileData);
      setProgress(calculateProfileProgress(profileData));
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleQualificationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInstituteChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousInstitutes: prev.previousInstitutes.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      )
    }));
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { 
        qualification: '', 
        specialization: '', 
        institution: '', 
        graduationYear: '', 
        additionalCertifications: '',
        qualifyingCertificate: '' 
      }]
    }));
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const addInstitute = () => {
    setFormData(prev => ({
      ...prev,
      previousInstitutes: [...prev.previousInstitutes, { name: '', position: '', duration: '' }]
    }));
  };

  const removeInstitute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousInstitutes: prev.previousInstitutes.filter((_, i) => i !== index)
    }));
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    try {
      // Save qualifications
      const dbQualifications = formData.qualifications.map(q => ({
        user_id: user.id,
        qualification: q.qualification,
        specialization: q.specialization,
        institution: q.institution,
        graduation_year: q.graduationYear ? parseInt(q.graduationYear) : null,
        additional_certifications: q.additionalCertifications,
        qualifying_certificate: q.qualifyingCertificate
      }));

      const { error: qualError } = await supabase
        .from('teacher_qualifications')
        .upsert(dbQualifications);

      if (qualError) throw qualError;

      // Save professional details
      const { error: profError } = await supabase
        .from('teacher_professional')
        .upsert({
          user_id: user.id,
          previous_institutes: formData.previousInstitutes,
          class_experience: formData.classExperience,
          teaching_experience_years: formData.teachingExperienceYears,
          primary_instrument: formData.primaryInstrument,
          primary_instrument_level: formData.primaryInstrumentLevel,
          secondary_instrument: formData.secondaryInstrument,
          secondary_instrument_level: formData.secondaryInstrumentLevel,
          performances: formData.performances,
          curriculum_experience: formData.curriculumExperience,
          musical_projects: formData.musicalProjects,
          teaching_philosophy: formData.teachingPhilosophy,
          bio: formData.bio,
          comfortable_genres: formData.comfortableGenres
        });

      if (profError) throw profError;

      // Save bank details
      const { error: bankError } = await supabase
        .from('teacher_bank_details')
        .upsert({
          user_id: user.id,
          account_holder_name: formData.bank.accountHolderName,
          bank_name: formData.bank.bankName,
          account_number: formData.bank.accountNumber,
          ifsc_code: formData.bank.ifscCode,
          upi_id: formData.bank.upiId,
          bank_proof: formData.bank.bankProof
        });

      if (bankError) throw bankError;

      await fetchProfileData();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  return {
    loading,
    progress,
    formData,
    handleInputChange,
    handleQualificationChange,
    handleArrayChange,
    handleInstituteChange,
    addQualification,
    removeQualification,
    addInstitute,
    removeInstitute,
    saveProfile
  };
};
