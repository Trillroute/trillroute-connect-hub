
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
import { AdminLevel } from '@/utils/permissions/types';

interface EditAdminDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (userId: string, newRole: 'admin' | 'teacher') => Promise<void>;
  onUpdateLevel?: (userId: string, newLevelName: string) => Promise<void>;
  isLoading: boolean;
}

const EditAdminDialog = ({
  admin,
  isOpen,
  onOpenChange,
  onUpdateRole,
  onUpdateLevel,
  isLoading,
}: EditAdminDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher'>('admin');
  const [selectedLevelName, setSelectedLevelName] = useState<string>('Limited View');
  const [adminLevels, setAdminLevels] = useState<AdminLevel[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  useEffect(() => {
    if (admin) {
      setSelectedRole(admin.role as 'admin' | 'teacher');
      setSelectedLevelName(admin.adminRoleName || 'Limited View');
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
      console.log('Loaded admin levels:', levels);
      setAdminLevels(levels);
    } catch (error) {
      console.error('Error loading admin levels:', error);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleSave = async () => {
    if (admin) {
      if (selectedRole !== admin.role) {
        await onUpdateRole(admin.id, selectedRole);
      }

      if (onUpdateLevel && selectedLevelName !== (admin.adminRoleName || 'Limited View')) {
        await onUpdateLevel(admin.id, selectedLevelName);
      }
    }
    onOpenChange(false);
  };

  const renderPermissionBadges = (permissions: string[], moduleType: string) => {
    const colors: Record<string, string> = {
      view: "bg-blue-100 text-blue-800",
      add: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800"
    };

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="text-xs font-medium text-gray-700 mr-1">{moduleType}:</span>
        {permissions.length > 0 ? (
          permissions.map(perm => (
            <span 
              key={`${moduleType}-${perm}`} 
              className={`text-xs px-2 py-0.5 rounded ${colors[perm] || "bg-gray-100 text-gray-800"}`}
            >
              {perm}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500">No permissions</span>
        )}
      </div>
    );
  };

  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
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
              className="flex flex-col space-y-3 mb-6"
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
                <RadioGroup
                  value={selectedLevelName}
                  onValueChange={setSelectedLevelName}
                  className="flex flex-col space-y-4"
                >
                  {isLoadingLevels ? (
                    <div className="flex justify-center p-4">
                      <p>Loading admin levels...</p>
                    </div>
                  ) : (
                    adminLevels.map((level) => (
                      <div key={level.name} className="flex items-start space-x-2 p-3 rounded hover:bg-muted border">
                        <RadioGroupItem value={level.name} id={`level-${level.name}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`level-${level.name}`} className="font-medium">{level.name}</Label>
                          <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <div>
                              {renderPermissionBadges(level.studentPermissions, 'Students')}
                              {renderPermissionBadges(level.teacherPermissions, 'Teachers')}
                              {renderPermissionBadges(level.adminPermissions, 'Admins')}
                            </div>
                            <div>
                              {renderPermissionBadges(level.coursePermissions, 'Courses')}
                              {renderPermissionBadges(level.leadPermissions, 'Leads')}
                              {renderPermissionBadges(level.levelPermissions || [], 'Levels')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </RadioGroup>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isLoadingLevels || 
              (selectedRole === admin.role && selectedLevelName === (admin.adminRoleName || "Limited View"))}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminDialog;
