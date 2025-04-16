
import React from 'react';
import { Home, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';

interface ContactInfoTabProps {
  formData: {
    primaryPhone: string;
    secondaryPhone: string;
    whatsappEnabled: boolean;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
}

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ 
  formData, 
  handleInputChange,
  handleSwitchChange
}) => {
  return (
    <TabsContent value="contact" className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="primaryPhone">Primary Phone</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="primaryPhone"
            type="tel"
            placeholder="Primary Phone"
            className="pl-10"
            value={formData.primaryPhone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="secondaryPhone">Secondary Phone (Optional)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="secondaryPhone"
            type="tel"
            placeholder="Secondary Phone"
            className="pl-10"
            value={formData.secondaryPhone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="whatsapp"
          checked={formData.whatsappEnabled}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="whatsapp">WhatsApp enabled on primary phone</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Home className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="address"
            type="text"
            placeholder="Your address"
            className="pl-10"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </TabsContent>
  );
};
