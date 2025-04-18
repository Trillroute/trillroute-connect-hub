
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface BankDetailsTabProps {
  formData: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    bankProof: string;
  };
  handleInputChange: (section: string, field: string, value: any) => void;
}

const BankDetailsTab = ({ formData, handleInputChange }: BankDetailsTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Bank Details for Salary Transfer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder's Name *</Label>
            <Input
              id="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('bank', 'accountHolderName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bank', 'bankName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('bank', 'accountNumber', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code *</Label>
            <Input
              id="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('bank', 'ifscCode', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID (optional)</Label>
            <Input
              id="upiId"
              value={formData.upiId}
              onChange={(e) => handleInputChange('bank', 'upiId', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankProof">Cancelled cheque/Statement first page photo</Label>
            <Input
              id="bankProof"
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange('bank', 'bankProof', file.name);
                }
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BankDetailsTab;
