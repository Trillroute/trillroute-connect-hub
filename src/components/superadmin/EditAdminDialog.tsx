
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
import { fetchAdminRoles } from './AdminRoleService';
import { AdminLevel } from '@/utils/adminPermissions';

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
  const [adminLevels, setAdminLevels] = useState<AdminLevel[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  useEffect(() => {
    if (admin) {
      setSelectedRole(admin.role as 'admin' | 'teacher');
    }
  }, [admin]);

  useEffect(() => {
    if (isOpen) {
      loadAdminLevels();
    }
  }, [isOpen]);

  const loadAdminLevels = async () => {
    try {
      setIsLoadingLevels(true);
      const levels = await fetchAdminRoles();
      setAdminLevels(levels);
      console.log('Loaded admin levels:', levels);
    } catch (error) {
      console.error('Error loading admin levels:', error);
    } finally {
      setIsLoadingLevels(false);
    }
  };

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

            {selectedRole === 'admin' && adminLevels.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Admin Permission Level</h3>
                <div className="text-sm text-muted-foreground mb-3">
                  Select the permission level for this administrator
                </div>
                <ScrollArea className="max-h-[200px] pr-4">
                  {isLoadingLevels ? (
                    <div className="py-2 text-sm text-muted-foreground">Loading admin levels...</div>
                  ) : (
                    adminLevels.map((level) => (
                      <div key={level.name} className="mb-2 p-2 border rounded hover:bg-muted cursor-pointer">
                        <div className="font-medium">{level.name}</div>
                        <div className="text-xs text-muted-foreground">{level.description}</div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            )}
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
