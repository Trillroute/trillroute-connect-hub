
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TeachingPhilosophyProps {
  formData: {
    teachingPhilosophy: string;
    bio: string;
    instagramLink: string;
    youtubeLink: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
}

const TeachingPhilosophy = ({ formData, handleInputChange }: TeachingPhilosophyProps) => {
  return (
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
  );
};

export default TeachingPhilosophy;
