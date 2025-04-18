
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    qualifications: [{ qualification: '', specialization: '', institution: '', graduationYear: '', additionalCertifications: '' }],
    previousInstitutes: [],
    classExperience: [],
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
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
      
      // Fetch qualifications
      const { data: qualifications } = await supabase
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

      // Calculate progress
      let progressCount = 0;
      if (qualifications && qualifications.length > 0) progressCount++;
      if (professional) progressCount++;
      if (bankDetails) progressCount++;
      
      setProgress((progressCount / 3) * 100);

      // Update form data
      setFormData({
        qualifications: qualifications || [{ qualification: '', specialization: '', institution: '', graduationYear: '', additionalCertifications: '' }],
        previousInstitutes: professional?.previous_institutes || [],
        classExperience: professional?.class_experience || [],
        bankDetails: bankDetails || {
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          upiId: '',
        }
      });

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
      qualifications: [...prev.qualifications, { qualification: '', specialization: '', institution: '', graduationYear: '', additionalCertifications: '' }]
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

    // Save qualifications
    const { error: qualError } = await supabase
      .from('teacher_qualifications')
      .upsert(
        formData.qualifications.map(q => ({
          user_id: user.id,
          ...q
        }))
      );

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

    // Save bank details
    const { error: bankError } = await supabase
      .from('teacher_bank_details')
      .upsert({
        user_id: user.id,
        ...formData.bankDetails
      });

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
