
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UserManagementUser } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import { AdminLevel } from '@/utils/adminPermissions';

interface EditUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (userId: string, userData: Partial<UserManagementUser>) => Promise<void>;
  onUpdateLevel?: (userId: string, newLevelName: string) => Promise<void>;
  isLoading: boolean;
  userRole?: 'Student' | 'Teacher' | 'Administrator';
  showAdminLevelSelector?: boolean;
}

// Default admin levels as fallback
const DEFAULT_ADMIN_LEVELS: AdminLevel[] = [
  {
    name: "Limited View",
    description: "View-only administrator",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"]
  },
  {
    name: "Standard Admin",
    description: "Regular administrator permissions",
    studentPermissions: ["view", "add", "edit"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit"],
    coursePermissions: ["view", "edit"]
  },
  {
    name: "Full Access",
    description: "Complete administrative access",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"]
  }
];

const EditUserDialog = ({
  user,
  isOpen,
  onOpenChange,
  onUpdateUser,
  onUpdateLevel,
  isLoading,
  userRole = 'Student',
  showAdminLevelSelector = false,
}: EditUserDialogProps) => {
  const { toast } = useToast();
  const { user: currentUser, isSuperAdmin } = useAuth();
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
    adminRoleName?: string;
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
    adminRoleName: '',
  });
  
  const [adminLevels, setAdminLevels] = useState<AdminLevel[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  
  // Determine if admin level editing is allowed
  const canEditAdminLevel = showAdminLevelSelector && 
    user?.role === 'admin' && 
    isSuperAdmin() && 
    onUpdateLevel !== undefined;

  useEffect(() => {
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
        adminRoleName: user.adminRoleName || '',
      });
      
      // If this is an admin and we can edit admin levels, load the admin roles
      if (canEditAdminLevel && isOpen) {
        loadAdminLevels();
      }
    }
  }, [user, isOpen, canEditAdminLevel]);

  const loadAdminLevels = async () => {
    try {
      setIsLoadingLevels(true);
      console.log('[EditUserDialog] Loading admin levels from database');
      const levels = await fetchAdminRoles();
      console.log('[EditUserDialog] Received admin levels:', levels);
      
      if (levels && levels.length > 0) {
        setAdminLevels(levels);
      } else {
        console.log('[EditUserDialog] No admin levels received, using defaults');
        setAdminLevels(DEFAULT_ADMIN_LEVELS);
      }
    } catch (error) {
      console.error('[EditUserDialog] Error loading admin levels:', error);
      setAdminLevels(DEFAULT_ADMIN_LEVELS);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Update user details
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
      
      // If admin level changed and we have the function to update it
      const levelChanged = canEditAdminLevel && 
                          formData.adminRoleName !== user.adminRoleName &&
                          formData.adminRoleName;
                          
      if (levelChanged && onUpdateLevel) {
        await onUpdateLevel(user.id, formData.adminRoleName as string);
      }
      
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
  
  const handleAdminLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, adminRoleName: value }));
  };

  // Helper to render permission badges
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

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit {userRole}</DialogTitle>
          <DialogDescription>
            Update {userRole.toLowerCase()} information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
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

            {/* Admin Level Selector for Admin users */}
            {canEditAdminLevel && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Administrator Permission Level</h3>
                {isLoadingLevels ? (
                  <p className="text-sm text-gray-500">Loading permission levels...</p>
                ) : (
                  <RadioGroup
                    value={formData.adminRoleName || ""}
                    onValueChange={handleAdminLevelChange}
                    className="flex flex-col space-y-3"
                  >
                    {adminLevels.map((level) => (
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
            )}

            <div className="flex justify-end gap-2 pt-2">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
