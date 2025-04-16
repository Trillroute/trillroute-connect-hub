
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

interface EditAdminLevelDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLevel: (userId: string, newLevel: number) => Promise<void>;
  isLoading: boolean;
}

// Define admin levels and their permissions
export const ADMIN_LEVELS = [
  {
    level: 0,
    name: "Level 0 (Super Admin Equivalent)",
    description: "All permissions and functionality as the super admins"
  },
  {
    level: 1,
    name: "Level 1",
    description: "View, Add and Remove Students, Teachers, and Courses"
  },
  {
    level: 2,
    name: "Level 2",
    description: "View and Add Students and Teachers, View, Add and Remove Courses"
  },
  {
    level: 3,
    name: "Level 3",
    description: "View, Add and Remove Students and Teachers, View and Add Courses"
  },
  {
    level: 4,
    name: "Level 4",
    description: "View and Add Students and Teachers, View and Add Courses"
  },
  {
    level: 5, 
    name: "Level 5",
    description: "View Students and Teachers, View and Add Courses"
  },
  {
    level: 6,
    name: "Level 6",
    description: "View and Add Students and Teachers, View Courses"
  },
  {
    level: 8,
    name: "Level 8",
    description: "View Students and Teachers, View Courses"
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
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    if (admin) {
      setSelectedLevel(admin.adminLevel || 8);
    }
  }, [admin]);

  const handleSave = async () => {
    if (admin && isSuperAdmin()) {
      await onUpdateLevel(admin.id, selectedLevel);
    }
  };

  if (!admin || !isSuperAdmin()) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Admin Permission Level</DialogTitle>
          <DialogDescription>
            Set permission level for {admin.firstName} {admin.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedLevel.toString()}
            onValueChange={(value) => setSelectedLevel(parseInt(value))}
            className="flex flex-col space-y-4"
          >
            {ADMIN_LEVELS.map((level) => (
              <div key={level.level} className="flex items-start space-x-2 p-2 rounded hover:bg-muted">
                <RadioGroupItem value={level.level.toString()} id={`level-${level.level}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`level-${level.level}`} className="font-medium">{level.name}</Label>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || selectedLevel === (admin.adminLevel || 8)}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminLevelDialog;
