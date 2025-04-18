
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface EmploymentDocumentsProps {
  formData: {
    pay_slips_files?: string[]; // Made optional
    relieving_letter?: string;  // Made optional
  };
  handleInputChange: (section: string, field: string, value: any) => void;
  handleArrayChange: (field: string, value: string[]) => void;
}

const EmploymentDocuments = ({ formData, handleInputChange, handleArrayChange }: EmploymentDocumentsProps) => {
  // Ensure pay_slips_files is always an array
  const paySlips = formData.pay_slips_files || [];

  const handlePaySlipChange = (index: number, value: string) => {
    const newPaySlips = [...paySlips];
    newPaySlips[index] = value;
    handleArrayChange('pay_slips_files', newPaySlips);
  };

  const addPaySlip = () => {
    handleArrayChange('pay_slips_files', [...paySlips, '']);
  };

  const removePaySlip = (index: number) => {
    const newPaySlips = paySlips.filter((_, i) => i !== index);
    handleArrayChange('pay_slips_files', newPaySlips);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Employment Documents</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Pay Slips (Last 3 months)</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addPaySlip}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add More
            </Button>
          </div>
          
          {paySlips.map((slip, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="file"
                className="flex-1"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handlePaySlipChange(index, file.name);
                  }
                }}
              />
              {paySlips.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePaySlip(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {paySlips.length === 0 && (
            <div className="flex items-center gap-2">
              <Input
                type="file"
                className="flex-1"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleArrayChange('pay_slips_files', [file.name]);
                  }
                }}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relievingLetter">Relieving Letter (from previous employer)</Label>
          <Input
            id="relievingLetter"
            type="file"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                handleInputChange('professional', 'relieving_letter', file.name);
              }
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default EmploymentDocuments;
