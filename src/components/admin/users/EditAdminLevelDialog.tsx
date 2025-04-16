
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
import { fetchAdminLevels } from '@/components/superadmin/AdminService';
import { AdminLevel, updateCachedAdminLevels } from '@/utils/adminPermissions';

interface EditAdminLevelDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLevel: (userId: string, newLevel: number) => Promise<void>;
  isLoading: boolean;
}

// Default admin levels as fallback
export const DEFAULT_ADMIN_LEVELS: AdminLevel[] = [
  {
    level: 0,
    name: "Level 0 (Super Admin Equivalent)",
    description: "All permissions and functionality as the super admins",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  {
    level: 1,
    name: "Level 1",
    description: "High-level administrator",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  {
    level: 2,
    name: "Level 2",
    description: "Mid-level administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  },
  {
    level: 3,
    name: "Level 3",
    description: "Mid-level administrator",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  {
    level: 4,
    name: "Level 4",
    description: "Limited administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  {
    level: 5,
    name: "Level 5",
    description: "View-only administrator with limited add capabilities",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add"]
  },
  {
    level: 6,
    name: "Level 6",
    description: "Limited administrator",
    studentPermissions: ["view", "add"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"]
  },
  {
    level: 8,
    name: "Level 8",
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
  const [selectedLevel, setSelectedLevel] = useState<number>(8);
  const [adminLevels, setAdminLevels] = useState<AdminLevel[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState<boolean>(false);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    if (admin) {
      setSelectedLevel(admin.adminLevel || 8);
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
      const levels = await fetchAdminLevels();
      setAdminLevels(levels);
      updateCachedAdminLevels(levels);
    } catch (error) {
      console.error('Error loading admin levels:', error);
      // Fallback to default levels if the fetch fails
      setAdminLevels(DEFAULT_ADMIN_LEVELS);
      updateCachedAdminLevels(DEFAULT_ADMIN_LEVELS);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleSave = async () => {
    if (admin && isSuperAdmin()) {
      await onUpdateLevel(admin.id, selectedLevel);
    }
  };

  if (!admin || !isSuperAdmin()) return null;

  const displayLevels = adminLevels.length > 0 
    ? adminLevels 
    : DEFAULT_ADMIN_LEVELS;

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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Admin Permission Level</DialogTitle>
          <DialogDescription>
            Set permission level for {admin.firstName} {admin.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingLevels ? (
            <div className="flex justify-center p-4">
              <p>Loading admin levels...</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedLevel.toString()}
              onValueChange={(value) => setSelectedLevel(parseInt(value))}
              className="flex flex-col space-y-4"
            >
              {displayLevels.map((level) => (
                <div key={level.level} className="flex items-start space-x-2 p-3 rounded hover:bg-muted border">
                  <RadioGroupItem value={level.level.toString()} id={`level-${level.level}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`level-${level.level}`} className="font-medium">{level.name}</Label>
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
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isLoadingLevels || selectedLevel === (admin.adminLevel || 8)}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminLevelDialog;
