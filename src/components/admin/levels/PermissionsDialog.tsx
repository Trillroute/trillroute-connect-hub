
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLevelDetailed, PermissionModuleType } from '@/types/adminLevel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { clearPermissionCache } from '@/utils/permissions';

interface PermissionsDialogProps {
  level: AdminLevelDetailed | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdatePermissions: (id: number, permissions: Partial<AdminLevelDetailed>) => void;
  isLoading: boolean;
}

const PermissionsDialog = ({
  level,
  isOpen,
  onOpenChange,
  onUpdatePermissions,
  isLoading,
}: PermissionsDialogProps) => {
  const [permissions, setPermissions] = useState<{
    studentPermissions: string[];
    teacherPermissions: string[];
    adminPermissions: string[];
    leadPermissions: string[];
    coursePermissions: string[];
    levelPermissions: string[];
  }>({
    studentPermissions: [],
    teacherPermissions: [],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: [],
    levelPermissions: [],
  });

  // Reset permissions state when level changes or dialog opens
  useEffect(() => {
    if (level) {
      setPermissions({
        studentPermissions: [...(level.studentPermissions || [])],
        teacherPermissions: [...(level.teacherPermissions || [])],
        adminPermissions: [...(level.adminPermissions || [])],
        leadPermissions: [...(level.leadPermissions || [])],
        coursePermissions: [...(level.coursePermissions || [])],
        levelPermissions: [...(level.levelPermissions || [])],
      });
    }
  }, [level, isOpen]);

  const moduleLabels: Record<PermissionModuleType, string> = {
    student: 'Student Management',
    teacher: 'Teacher Management',
    admin: 'Admin Management',
    lead: 'Lead Management',
    course: 'Course Management',
    level: 'Level Management',
  };

  const permissionOptions = ['view', 'add', 'edit', 'delete'];
  
  const permissionDescriptions: Record<string, string> = {
    view: 'Can view and access this module',
    add: 'Can create new items in this module',
    edit: 'Can modify existing items in this module',
    delete: 'Can remove items from this module'
  };

  const togglePermission = (module: PermissionModuleType, permission: string) => {
    const permissionKey = `${module}Permissions` as keyof typeof permissions;
    const currentPermissions = [...permissions[permissionKey]];
    
    if (currentPermissions.includes(permission)) {
      // If removing view permission but other permissions exist, prevent removal
      if (permission === 'view' && currentPermissions.some(p => p !== 'view')) {
        return;
      }
      
      // Remove the permission
      const updatedPermissions = currentPermissions.filter(p => p !== permission);
      setPermissions({
        ...permissions,
        [permissionKey]: updatedPermissions,
      });
    } else {
      // Add the permission
      const updatedPermissions = [...currentPermissions];
      
      if (!updatedPermissions.includes(permission)) {
        updatedPermissions.push(permission);
      }
      
      // Ensure 'view' permission is always added when adding other permissions
      if (permission !== 'view' && !updatedPermissions.includes('view')) {
        updatedPermissions.push('view');
      }
      
      setPermissions({
        ...permissions,
        [permissionKey]: updatedPermissions,
      });
    }
  };

  const handleSave = () => {
    if (!level) return;
    
    // Clear the permission cache to ensure fresh permission checks after update
    clearPermissionCache();
    
    // Update permissions
    onUpdatePermissions(level.id, permissions);
  };

  if (!level) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Edit Permissions for {level.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <Tabs defaultValue="student">
            <div className="relative overflow-x-auto mb-4">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-max">
                  {Object.keys(moduleLabels).map((module) => (
                    <TabsTrigger key={module} value={module}>
                      {moduleLabels[module as PermissionModuleType]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {Object.keys(moduleLabels).map((moduleKey) => {
              const module = moduleKey as PermissionModuleType;
              const permissionKey = `${module}Permissions` as keyof typeof permissions;
              
              return (
                <TabsContent key={module} value={module} className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">
                      {moduleLabels[module]} Permissions
                    </h3>
                    <div className="space-y-3">
                      {permissionOptions.map((permission) => {
                        const isChecked = permissions[permissionKey].includes(permission);
                        const isDisabled = 
                          permission === 'view' && 
                          permissions[permissionKey].some(p => p !== 'view');

                        return (
                          <div
                            key={permission}
                            className="flex items-center space-x-2 p-3 border-b last:border-b-0"
                          >
                            <Checkbox 
                              id={`${module}-${permission}`}
                              checked={isChecked}
                              onCheckedChange={() => togglePermission(module, permission)}
                              disabled={isDisabled}
                            />
                            <div className="flex-grow">
                              <label 
                                htmlFor={`${module}-${permission}`}
                                className={`flex items-center capitalize ${isDisabled ? 'text-gray-400' : ''}`}
                              >
                                {permission} {moduleLabels[module].toLowerCase().replace(' management', '')}
                                
                                {isDisabled && (
                                  <span className="text-xs ml-2 text-amber-500">
                                    (Required for other permissions)
                                  </span>
                                )}
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{permissionDescriptions[permission]}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {permissionDescriptions[permission]}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Permissions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsDialog;
