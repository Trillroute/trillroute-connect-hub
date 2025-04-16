
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditAdminDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (userId: string, newRole: 'admin' | 'teacher') => Promise<void>;
  isLoading: boolean;
}

const EditAdminDialog = ({
  admin,
  isOpen,
  onOpenChange,
  onUpdateRole,
  isLoading,
}: EditAdminDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher'>('admin');

  useEffect(() => {
    if (admin) {
      setSelectedRole(admin.role as 'admin' | 'teacher');
    }
  }, [admin]);

  const handleSave = async () => {
    if (admin) {
      await onUpdateRole(admin.id, selectedRole);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Administrator Role</DialogTitle>
          <DialogDescription>
            Change the role of {admin.firstName} {admin.lastName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-14rem)] pr-4">
          <div className="py-4">
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as 'admin' | 'teacher')}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="font-medium">Administrator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="font-medium">Teacher</Label>
              </div>
            </RadioGroup>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || selectedRole === admin.role}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminDialog;
