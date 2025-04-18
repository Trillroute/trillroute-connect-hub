
import React from 'react';
import TeachingExperience from './professional/TeachingExperience';
import PreviousInstitutes from './professional/PreviousInstitutes';
import ClassExperience from './professional/ClassExperience';
import PerformanceCurriculum from './professional/PerformanceCurriculum';
import MusicalPreferences from './professional/MusicalPreferences';
import EmploymentDocuments from './professional/EmploymentDocuments';
import TeachingPhilosophy from './professional/TeachingPhilosophy';

interface ProfessionalInfoTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, value: string[]) => void;
  handleInstituteChange: (index: number, field: string, value: string) => void;
  addInstitute: () => void;
  removeInstitute: (index: number) => void;
}

const ProfessionalInfoTab = ({
  formData,
  handleInputChange,
  handleArrayChange,
  handleInstituteChange,
  addInstitute,
  removeInstitute
}: ProfessionalInfoTabProps) => {
  return (
    <div className="space-y-6">
      <TeachingExperience formData={formData} handleInputChange={handleInputChange} />
      
      <PreviousInstitutes
        institutes={formData.previousInstitutes}
        handleInstituteChange={handleInstituteChange}
        addInstitute={addInstitute}
        removeInstitute={removeInstitute}
      />
      
      <ClassExperience
        classExperience={formData.classExperience}
        handleArrayChange={handleArrayChange}
      />
      
      <PerformanceCurriculum
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <MusicalPreferences
        formData={formData}
        handleInputChange={handleInputChange}
        handleArrayChange={handleArrayChange}
      />
      
      <EmploymentDocuments
        formData={formData}
        handleInputChange={handleInputChange}
        handleArrayChange={handleArrayChange}
      />
      
      <TeachingPhilosophy
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default ProfessionalInfoTab;
