
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface TeachingExperienceProps {
  formData: {
    teachingExperienceYears: number;
    primaryInstrument: string;
    primaryInstrumentLevel: string;
    secondaryInstrument: string;
    secondaryInstrumentLevel: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
}

const TeachingExperience = ({ formData, handleInputChange }: TeachingExperienceProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Teaching Experience</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teachingExperienceYears">Total Years of Teaching Experience</Label>
          <Input
            id="teachingExperienceYears"
            type="number"
            min="0"
            value={formData.teachingExperienceYears}
            onChange={(e) => handleInputChange('professional', 'teachingExperienceYears', Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryInstrument">Primary Instrument</Label>
          <Input
            id="primaryInstrument"
            value={formData.primaryInstrument}
            onChange={(e) => handleInputChange('professional', 'primaryInstrument', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryInstrumentLevel">Primary Instrument Level</Label>
          <Input
            id="primaryInstrumentLevel"
            value={formData.primaryInstrumentLevel}
            onChange={(e) => handleInputChange('professional', 'primaryInstrumentLevel', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryInstrument">Secondary Instrument</Label>
          <Input
            id="secondaryInstrument"
            value={formData.secondaryInstrument}
            onChange={(e) => handleInputChange('professional', 'secondaryInstrument', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryInstrumentLevel">Secondary Instrument Level</Label>
          <Input
            id="secondaryInstrumentLevel"
            value={formData.secondaryInstrumentLevel}
            onChange={(e) => handleInputChange('professional', 'secondaryInstrumentLevel', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default TeachingExperience;
