import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import CountrySelect from './CountrySelect';

interface PersonalInfoTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const PersonalInfoTab = ({ formData, handleInputChange }: PersonalInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('personal', 'gender', value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address (Official) *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('personal', 'password', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalEmail">Email Address (Personal)</Label>
            <Input
              id="personalEmail"
              type="email"
              value={formData.personalEmail}
              onChange={(e) => handleInputChange('personal', 'personalEmail', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryPhone">Contact Number</Label>
            <Input
              id="primaryPhone"
              value={formData.primaryPhone}
              onChange={(e) => handleInputChange('personal', 'primaryPhone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryPhone">Alternate Contact Number</Label>
            <Input
              id="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={(e) => handleInputChange('personal', 'secondaryPhone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <CountrySelect
              value={formData.nationality || ""}
              onValueChange={(value) => handleInputChange('personal', 'nationality', value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Address Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Current Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanentAddress">Permanent Address</Label>
            <Input
              id="permanentAddress"
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange('personal', 'permanentAddress', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Name</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('personal', 'emergencyContactName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactRelation">Relation</Label>
            <Input
              id="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={(e) => handleInputChange('personal', 'emergencyContactRelation', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactNumber">Number</Label>
            <Input
              id="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={(e) => handleInputChange('personal', 'emergencyContactNumber', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">ID Proofs & Photograph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idProofPan">PAN Card</Label>
            <Input
              id="idProofPan"
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange('personal', 'idProofPan', file.name);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idProofAadhaar">Aadhaar Card</Label>
            <Input
              id="idProofAadhaar"
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange('personal', 'idProofAadhaar', file.name);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Passport Size Photograph</Label>
            <Input
              id="profilePhoto"
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange('personal', 'profilePhoto', file.name);
                }
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
