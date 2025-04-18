
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
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

  const calculateProgress = (data: any) => {
    const fields = [
      // Personal fields
      data.teachingExperienceYears,
      data.primaryInstrument,
      data.primaryInstrumentLevel,
      data.secondaryInstrument,
      data.secondaryInstrumentLevel,
      // Professional fields
      data.performances,
      data.curriculumExperience,
      data.musicalProjects,
      data.teachingPhilosophy,
      data.bio,
      // Bank details
      data.bank?.accountHolderName,
      data.bank?.bankName,
      data.bank?.accountNumber,
      data.bank?.ifscCode,
      // Arrays (check if they have items)
      ...(data.qualifications || []).map(q => q.qualification),
      ...(data.previousInstitutes || []).map(i => i.name),
      ...(data.classExperience || []),
      ...(data.comfortableGenres || [])
    ];

    const nonEmptyFields = fields.filter(field => {
      if (Array.isArray(field)) {
        return field.length > 0;
      }
      return field !== undefined && field !== null && field !== '';
    });

    return (nonEmptyFields.length / fields.length) * 100;
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch qualifications
      const { data: qualificationsData } = await supabase
        .from('teacher_qualifications')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch professional details
      const { data: professional } = await supabase
        .from('teacher_professional')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch bank details
      const { data: bankDetails } = await supabase
        .from('teacher_bank_details')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Map database fields (snake_case) to application fields (camelCase)
      const mappedQualifications = qualificationsData 
        ? qualificationsData.map(q => ({
            qualification: q.qualification || '',
            specialization: q.specialization || '',
            institution: q.institution || '',
            graduationYear: q.graduation_year ? String(q.graduation_year) : '',
            additionalCertifications: q.additional_certifications || '',
            qualifyingCertificate: q.qualifying_certificate || '',
          }))
        : [{ 
            qualification: '', 
            specialization: '', 
            institution: '', 
            graduationYear: '', 
            additionalCertifications: '',
            qualifyingCertificate: ''
          }];
      
      // Map professional data 
      const previousInstitutes = professional?.previous_institutes 
        ? (typeof professional.previous_institutes === 'string' 
            ? JSON.parse(professional.previous_institutes) 
            : professional.previous_institutes)
        : [];

      const classExperience = professional?.class_experience || [];
      const comfortableGenres = professional?.comfortable_genres || [];
      const teachingExperienceYears = professional?.teaching_experience_years;
      const primaryInstrument = professional?.primary_instrument;
      const primaryInstrumentLevel = professional?.primary_instrument_level;
      const secondaryInstrument = professional?.secondary_instrument;
      const secondaryInstrumentLevel = professional?.secondary_instrument_level;
      const performances = professional?.performances;
      const curriculumExperience = professional?.curriculum_experience;
      const musicalProjects = professional?.musical_projects;
      const teachingPhilosophy = professional?.teaching_philosophy;
      const bio = professional?.bio;

      // Map bank details
      const mappedBankDetails = bankDetails 
        ? {
            accountHolderName: bankDetails.account_holder_name || '',
            bankName: bankDetails.bank_name || '',
            accountNumber: bankDetails.account_number || '',
            ifscCode: bankDetails.ifsc_code || '',
            upiId: bankDetails.upi_id || '',
            bankProof: bankDetails.bank_proof || '',
          }
        : {
            accountHolderName: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            upiId: '',
            bankProof: '',
          };

      // Update form data
      const updatedFormData = {
        qualifications: mappedQualifications,
        previousInstitutes: previousInstitutes,
        classExperience: Array.isArray(classExperience) ? classExperience : [],
        bank: mappedBankDetails,
        teachingExperienceYears,
        primaryInstrument,
        primaryInstrumentLevel,
        secondaryInstrument,
        secondaryInstrumentLevel,
        performances,
        curriculumExperience,
        musicalProjects,
        teachingPhilosophy,
        bio,
        comfortableGenres
      };
      
      setFormData(updatedFormData);
      setProgress(calculateProgress(updatedFormData));

    } catch (error) {
      console.error('Error fetching profile data:', error);
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
        qualifyingCertificate: ''  // Added this field
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

    // Map application fields (camelCase) back to database fields (snake_case) for qualifications
    const dbQualifications = formData.qualifications.map(q => ({
      user_id: user.id,
      qualification: q.qualification,
      specialization: q.specialization,
      institution: q.institution,
      graduation_year: q.graduationYear ? parseInt(q.graduationYear) : null,
      additional_certifications: q.additionalCertifications,
      qualifying_certificate: q.qualifyingCertificate
    }));

    // Save qualifications
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
        class_experience: formData.classExperience
      });

    if (profError) throw profError;

    // Map application fields (camelCase) back to database fields (snake_case) for bank details
    const dbBankDetails = {
      user_id: user.id,
      account_holder_name: formData.bank.accountHolderName,
      bank_name: formData.bank.bankName,
      account_number: formData.bank.accountNumber,
      ifsc_code: formData.bank.ifscCode,
      upi_id: formData.bank.upiId,
      bank_proof: formData.bank.bankProof
    };

    // Save bank details
    const { error: bankError } = await supabase
      .from('teacher_bank_details')
      .upsert(dbBankDetails);

    if (bankError) throw bankError;

    await fetchProfileData();
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
