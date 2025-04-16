
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
import { useAuth } from '@/hooks/useAuth';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import { AdminLevel, updateCachedAdminRoles } from '@/utils/adminPermissions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditAdminLevelDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLevel: (userId: string, newLevelName: string) => Promise<void>;
  isLoading: boolean;
}

// Default admin levels as fallback - only used if DB fetch fails
export const DEFAULT_ADMIN_LEVELS: AdminLevel[] = [
  {
    name: "Limited View",
    description: "View-only administrator",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"]
  }
];

const EditAdminLevelDialog = ({
  admin,
  isOpen,
  onOpenChange,
  onUpdateLevel,
  isLoading,
}: EditAdminLevelDialogProps) => {
  const [selectedLevelName, setSelectedLevelName] = useState<string>("Limited View");
  const [adminLevels, setAdminLevels] = useState<AdminLevel[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState<boolean>(false);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    if (admin) {
      setSelectedLevelName(admin.adminRoleName || "Limited View");
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
      console.log('[EditAdminLevelDialog] Loading admin levels from database');
      const levels = await fetchAdminRoles();
      console.log('[EditAdminLevelDialog] Received admin levels:', levels);
      setAdminLevels(levels);
      updateCachedAdminRoles(levels);
    } catch (error) {
      console.error('[EditAdminLevelDialog] Error loading admin levels:', error);
      // Fallback to default levels if the fetch fails
      setAdminLevels(DEFAULT_ADMIN_LEVELS);
      updateCachedAdminRoles(DEFAULT_ADMIN_LEVELS);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleSave = async () => {
    if (admin && isSuperAdmin()) {
      await onUpdateLevel(admin.id, selectedLevelName);
    }
  };

  if (!admin || !isSuperAdmin()) return null;

  const displayLevels = adminLevels.length > 0 
    ? adminLevels 
    : DEFAULT_ADMIN_LEVELS;

  console.log('[EditAdminLevelDialog] Display levels:', displayLevels);

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Admin Permission Level</DialogTitle>
          <DialogDescription>
            Set permission level for {admin.firstName} {admin.lastName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-14rem)] pr-4">
          <div className="py-4">
            {isLoadingLevels ? (
              <div className="flex justify-center p-4">
                <p>Loading admin levels...</p>
              </div>
            ) : (
              <RadioGroup
                value={selectedLevelName}
                onValueChange={(value) => setSelectedLevelName(value)}
                className="flex flex-col space-y-4"
              >
                {displayLevels.map((level) => (
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isLoadingLevels || selectedLevelName === (admin.adminRoleName || "Limited View")}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminLevelDialog;
