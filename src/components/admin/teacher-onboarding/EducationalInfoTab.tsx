
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';

interface EducationalInfoTabProps {
  formData: {
    qualifications: {
      qualification: string;
      specialization: string;
      institution: string;
      graduationYear: string;
      additionalCertifications: string;
    }[];
  };
  handleQualificationChange: (index: number, field: string, value: string) => void;
  addQualification: () => void;
  removeQualification: (index: number) => void;
}

const EducationalInfoTab = ({ 
  formData, 
  handleQualificationChange, 
  addQualification, 
  removeQualification 
}: EducationalInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Educational Qualifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addQualification}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Qualification
          </Button>
        </div>
        
        {formData.qualifications.map((qualification, index) => (
          <div key={index} className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Qualification #{index + 1}</h4>
              {formData.qualifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQualification(index)}
                >
                  <Minus className="h-4 w-4 mr-2" /> Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`qualification-${index}`}>Qualification</Label>
                <Input
                  id={`qualification-${index}`}
                  value={qualification.qualification}
                  onChange={(e) => handleQualificationChange(index, 'qualification', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`specialization-${index}`}>Specialization/Stream</Label>
                <Input
                  id={`specialization-${index}`}
                  value={qualification.specialization}
                  placeholder="e.g., Music, Sound Engineering, etc."
                  onChange={(e) => handleQualificationChange(index, 'specialization', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Name of Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={qualification.institution}
                  onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`graduationYear-${index}`}>Year of Graduation</Label>
                <Input
                  id={`graduationYear-${index}`}
                  type="number"
                  value={qualification.graduationYear}
                  onChange={(e) => handleQualificationChange(index, 'graduationYear', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`additionalCertifications-${index}`}>Additional Certifications</Label>
                <Input
                  id={`additionalCertifications-${index}`}
                  value={qualification.additionalCertifications}
                  onChange={(e) => handleQualificationChange(index, 'additionalCertifications', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default EducationalInfoTab;
