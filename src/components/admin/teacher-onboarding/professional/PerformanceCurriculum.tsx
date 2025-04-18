
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PerformanceCurriculumProps {
  formData: {
    performances: string;
    curriculumExperience: string;
    musicalProjects: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
}

const PerformanceCurriculum = ({ formData, handleInputChange }: PerformanceCurriculumProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Performance & Curriculum Experience</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="performances">Concerts, Performances, or Notable Gigs</Label>
          <Textarea
            id="performances"
            value={formData.performances}
            onChange={(e) => handleInputChange('professional', 'performances', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="curriculumExperience">Experience with Curriculum Planning, Content Creation</Label>
          <Textarea
            id="curriculumExperience"
            value={formData.curriculumExperience}
            onChange={(e) => handleInputChange('professional', 'curriculumExperience', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="musicalProjects">Musical Projects</Label>
          <Textarea
            id="musicalProjects"
            value={formData.musicalProjects}
            onChange={(e) => handleInputChange('professional', 'musicalProjects', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCurriculum;
