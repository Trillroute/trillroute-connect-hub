
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';

interface PreviousInstitutesProps {
  institutes: { name: string; location: string; years: string; }[];
  handleInstituteChange: (index: number, field: string, value: string) => void;
  addInstitute: () => void;
  removeInstitute: (index: number) => void;
}

const PreviousInstitutes = ({
  institutes,
  handleInstituteChange,
  addInstitute,
  removeInstitute
}: PreviousInstitutesProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Institutes Previously Worked At</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addInstitute}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Institute
        </Button>
      </div>
      
      {institutes.map((institute, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-0">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Institute #{index + 1}</h4>
            {institutes.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInstitute(index)}
              >
                <Minus className="h-4 w-4 mr-2" /> Remove
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`instituteName-${index}`}>Name</Label>
              <Input
                id={`instituteName-${index}`}
                value={institute.name}
                onChange={(e) => handleInstituteChange(index, 'name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`instituteLocation-${index}`}>Location</Label>
              <Input
                id={`instituteLocation-${index}`}
                value={institute.location}
                onChange={(e) => handleInstituteChange(index, 'location', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`instituteYears-${index}`}>Years</Label>
              <Input
                id={`instituteYears-${index}`}
                value={institute.years}
                placeholder="e.g., 2018-2020"
                onChange={(e) => handleInstituteChange(index, 'years', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default PreviousInstitutes;
