
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ClassExperienceProps {
  classExperience: string[];
  handleArrayChange: (field: string, value: string[]) => void;
}

const classExperienceOptions = [
  { id: 'one-on-one', label: 'One-on-One' },
  { id: 'group', label: 'Group Classes' },
  { id: 'online', label: 'Online Classes' }
];

const ClassExperience = ({ classExperience, handleArrayChange }: ClassExperienceProps) => {
  const handleClassExperienceChange = (value: string) => {
    const updated = classExperience.includes(value)
      ? classExperience.filter(v => v !== value)
      : [...classExperience, value];
    handleArrayChange('classExperience', updated);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Class Experience</h3>
      <div className="space-y-3">
        <Label>Teaching Format Experience</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {classExperienceOptions.map(option => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`class-experience-${option.id}`}
                checked={classExperience.includes(option.id)}
                onCheckedChange={() => handleClassExperienceChange(option.id)}
              />
              <Label htmlFor={`class-experience-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ClassExperience;
