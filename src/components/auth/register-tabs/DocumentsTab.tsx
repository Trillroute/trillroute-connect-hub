
import React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DocumentsTabProps {
  formData: {
    profilePhoto: string;
    idProof: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="profilePhoto">Profile Photo URL (Optional)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="profilePhoto"
            type="text"
            placeholder="URL to profile photo"
            className="pl-10"
            value={formData.profilePhoto}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="idProof">ID Proof (Optional)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="idProof"
            type="text"
            placeholder="URL to ID proof document"
            className="pl-10"
            value={formData.idProof}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
