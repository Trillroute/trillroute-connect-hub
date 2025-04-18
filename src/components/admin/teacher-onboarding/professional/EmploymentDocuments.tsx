
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmploymentDocumentsProps {
  formData: {
    pay_slips_files: string[];
    relieving_letter: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, value: string[]) => void;
}

const EmploymentDocuments = ({ formData, handleInputChange, handleArrayChange }: EmploymentDocumentsProps) => {
  const handlePaySlipsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      handleArrayChange('pay_slips_files', fileNames);
    }
  };

  return (
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleInputChange('professional', 'relieving_letter', file.name);
                }
              }}
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
  );
};

export default EmploymentDocuments;
