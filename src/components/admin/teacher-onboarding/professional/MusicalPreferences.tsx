
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface MusicalPreferencesProps {
  formData: {
    comfortableGenres?: string[]; // Make this property optional with '?'
    signatureStrength?: string;
    performancePhoto?: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, value: string[]) => void;
}

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

const MusicalPreferences = ({ formData, handleInputChange, handleArrayChange }: MusicalPreferencesProps) => {
  // Ensure comfortableGenres is always an array, even if it's undefined in formData
  const genres = formData.comfortableGenres || [];
  
  const handleGenreChange = (value: string) => {
    const updated = genres.includes(value)
      ? genres.filter(v => v !== value)
      : [...genres, value];
    handleArrayChange('comfortableGenres', updated);
  };

  return (
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
                  checked={genres.includes(option.id)}
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
            value={formData.signatureStrength || ''}
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
  );
};

export default MusicalPreferences;
