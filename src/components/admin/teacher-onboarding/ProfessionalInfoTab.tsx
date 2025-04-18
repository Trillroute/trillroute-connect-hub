
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';

interface ProfessionalInfoTabProps {
  formData: {
    teachingExperienceYears: number;
    primaryInstrument: string;
    primaryInstrumentLevel: string;
    secondaryInstrument: string;
    secondaryInstrumentLevel: string;
    previousInstitutes: {
      name: string;
      location: string;
      years: string;
    }[];
    classExperience: string[];
    performances: string;
    curriculumExperience: string;
    musicalProjects: string;
    comfortableGenres: string[];
    signatureStrength: string;
    performancePhoto: string;
    teachingPhilosophy: string;
    bio: string;
    instagramLink: string;
    youtubeLink: string;
    pay_slips_files: string[];
    relieving_letter: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, value: string[]) => void;
  handleInstituteChange: (index: number, field: string, value: string) => void;
  addInstitute: () => void;
  removeInstitute: (index: number) => void;
}

const classExperienceOptions = [
  { id: 'one-on-one', label: 'One-on-One' },
  { id: 'group', label: 'Group Classes' },
  { id: 'online', label: 'Online Classes' }
];

const genreOptions = [
  { id: 'classical', label: 'Classical' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'rock', label: 'Rock' },
  { id: 'pop', label: 'Pop' },
  { id: 'folk', label: 'Folk' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'world', label: 'World Music' },
  { id: 'rnb', label: 'R&B/Soul' }
];

const ProfessionalInfoTab = ({
  formData,
  handleInputChange,
  handleArrayChange,
  handleInstituteChange,
  addInstitute,
  removeInstitute
}: ProfessionalInfoTabProps) => {
  
  const handleClassExperienceChange = (value: string) => {
    const updated = formData.classExperience.includes(value)
      ? formData.classExperience.filter(v => v !== value)
      : [...formData.classExperience, value];
    handleArrayChange('classExperience', updated);
  };
  
  const handleGenreChange = (value: string) => {
    const updated = formData.comfortableGenres.includes(value)
      ? formData.comfortableGenres.filter(v => v !== value)
      : [...formData.comfortableGenres, value];
    handleArrayChange('comfortableGenres', updated);
  };

  const handlePaySlipsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      handleArrayChange('pay_slips_files', fileNames);
    }
  };

  const handleRelievingLetterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('professional', 'relieving_letter', file.name);
    }
  };

  return (
    <div className="space-y-6">
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
        
        {formData.previousInstitutes.map((institute, index) => (
          <div key={index} className="mb-6 border-b pb-4 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Institute #{index + 1}</h4>
              {formData.previousInstitutes.length > 1 && (
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
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Class Experience</h3>
        <div className="space-y-3">
          <Label>Teaching Format Experience</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {classExperienceOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`class-experience-${option.id}`}
                  checked={formData.classExperience.includes(option.id)}
                  onCheckedChange={() => handleClassExperienceChange(option.id)}
                />
                <Label htmlFor={`class-experience-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
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
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Musical Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Comfortable Genres</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {genreOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${option.id}`}
                    checked={formData.comfortableGenres.includes(option.id)}
                    onCheckedChange={() => handleGenreChange(option.id)}
                  />
                  <Label htmlFor={`genre-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signatureStrength">Signature Strength</Label>
            <Input
              id="signatureStrength"
              placeholder="Ex: Reharmonisation"
              value={formData.signatureStrength}
              onChange={(e) => handleInputChange('professional', 'signatureStrength', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="performancePhoto">Photograph (performance/teaching)</Label>
            <Input
              id="performancePhoto"
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange('professional', 'performancePhoto', file.name);
                }
              }}
            />
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Employment Documents</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paySlips">Pay Slips (Upload up to 3 PDFs)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="paySlips"
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePaySlipsUpload}
                className="flex-1"
              />
              {formData.pay_slips_files.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {formData.pay_slips_files.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relievingLetter">Relieving Letter (Upload 1 PDF)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="relievingLetter"
                type="file"
                accept=".pdf"
                onChange={handleRelievingLetterUpload}
                className="flex-1"
              />
              {formData.relieving_letter && (
                <div className="text-sm text-muted-foreground">
                  1 file selected
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Bio & Teaching Philosophy</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teachingPhilosophy">What does music and teaching mean to you?</Label>
            <Textarea
              id="teachingPhilosophy"
              value={formData.teachingPhilosophy}
              onChange={(e) => handleInputChange('professional', 'teachingPhilosophy', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('professional', 'bio', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagramLink">Instagram Link</Label>
              <Input
                id="instagramLink"
                value={formData.instagramLink}
                onChange={(e) => handleInputChange('professional', 'instagramLink', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Channel Link</Label>
              <Input
                id="youtubeLink"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('professional', 'youtubeLink', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfessionalInfoTab;
