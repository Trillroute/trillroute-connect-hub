
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { useToast } from '@/hooks/use-toast';

interface EditUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (userId: string, userData: Partial<UserManagementUser>) => Promise<void>;
  isLoading: boolean;
  userRole?: 'Student' | 'Teacher' | 'Administrator';
}

const EditUserDialog = ({
  user,
  isOpen,
  onOpenChange,
  onUpdateUser,
  isLoading,
  userRole = 'Student',
}: EditUserDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    primaryPhone: string;
    secondaryPhone?: string;
    address?: string;
    dateOfBirth?: string;
    parentName?: string;
    guardianRelation?: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    address: '',
    dateOfBirth: '',
    parentName: '',
    guardianRelation: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        primaryPhone: user.primaryPhone || '',
        secondaryPhone: user.secondaryPhone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        parentName: user.parentName || '',
        guardianRelation: user.guardianRelation || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await onUpdateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        parentName: formData.parentName,
        guardianRelation: formData.guardianRelation,
      });
      
      toast({
        title: 'Success',
        description: `${userRole} updated successfully.`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error(`Error updating ${userRole.toLowerCase()}:`, error);
      toast({
        title: 'Error',
        description: error.message || `Failed to update ${userRole.toLowerCase()}.`,
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {userRole}</DialogTitle>
          <DialogDescription>
            Update {userRole.toLowerCase()} information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="primaryPhone" className="text-sm font-medium">
                Primary Phone
              </label>
              <input
                id="primaryPhone"
                name="primaryPhone"
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={formData.primaryPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="secondaryPhone" className="text-sm font-medium">
                Secondary Phone
              </label>
              <input
                id="secondaryPhone"
                name="secondaryPhone"
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={formData.secondaryPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <input
              id="address"
              name="address"
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="dateOfBirth" className="text-sm font-medium">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
            />
          </div>

          {userRole === 'Student' && (
            <>
              <div className="grid gap-2">
                <label htmlFor="parentName" className="text-sm font-medium">
                  Parent/Guardian Name
                </label>
                <input
                  id="parentName"
                  name="parentName"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.parentName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="guardianRelation" className="text-sm font-medium">
                  Guardian Relationship
                </label>
                <input
                  id="guardianRelation"
                  name="guardianRelation"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
