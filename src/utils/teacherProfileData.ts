
import { supabase } from '@/integrations/supabase/client';
import { TeacherProfileFormData } from '@/types/teacherProfile';

export const fetchTeacherProfileData = async (userId: string) => {
  try {
    // Fetch qualifications
    const { data: qualificationsData } = await supabase
      .from('teacher_qualifications')
      .select('*')
      .eq('user_id', userId);

    // Fetch professional details
    const { data: professional } = await supabase
      .from('teacher_professional')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch bank details
    const { data: bankDetails } = await supabase
      .from('teacher_bank_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Map database fields to application fields
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

    const previousInstitutes = professional?.previous_institutes 
      ? (typeof professional.previous_institutes === 'string' 
          ? JSON.parse(professional.previous_institutes) 
          : professional.previous_institutes)
      : [];

    const formData: TeacherProfileFormData = {
      qualifications: mappedQualifications,
      previousInstitutes,
      classExperience: professional?.class_experience || [],
      bank: bankDetails ? {
        accountHolderName: bankDetails.account_holder_name || '',
        bankName: bankDetails.bank_name || '',
        accountNumber: bankDetails.account_number || '',
        ifscCode: bankDetails.ifsc_code || '',
        upiId: bankDetails.upi_id || '',
        bankProof: bankDetails.bank_proof || '',
      } : {
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        bankProof: '',
      },
      teachingExperienceYears: professional?.teaching_experience_years,
      primaryInstrument: professional?.primary_instrument,
      primaryInstrumentLevel: professional?.primary_instrument_level,
      secondaryInstrument: professional?.secondary_instrument,
      secondaryInstrumentLevel: professional?.secondary_instrument_level,
      performances: professional?.performances,
      curriculumExperience: professional?.curriculum_experience,
      musicalProjects: professional?.musical_projects,
      teachingPhilosophy: professional?.teaching_philosophy,
      bio: professional?.bio,
      comfortableGenres: professional?.comfortable_genres || []
    };

    return formData;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};
