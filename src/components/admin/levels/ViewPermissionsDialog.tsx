
import React from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface ViewPermissionsDialogProps {
  level: AdminLevelDetailed | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ViewPermissionsDialog = ({
  level,
  isOpen,
  onOpenChange,
}: ViewPermissionsDialogProps) => {
  if (!level) return null;

  const moduleLabels: Record<PermissionModuleType, string> = {
    student: 'Student Management',
    teacher: 'Teacher Management',
    admin: 'Admin Management',
    lead: 'Lead Management',
    course: 'Course Management',
    level: 'Level Management',
  };

  const permissionColors: Record<string, string> = {
    view: 'bg-blue-100 text-blue-800 border-blue-200',
    add: 'bg-green-100 text-green-800 border-green-200',
    edit: 'bg-amber-100 text-amber-800 border-amber-200',
    delete: 'bg-red-100 text-red-800 border-red-200'
  };

  // Helper function to ensure we have a string array
  const ensureStringArray = (permissions: string | number | string[]): string[] => {
    if (Array.isArray(permissions)) {
      return permissions;
    }
    return [];
  };

  const renderPermissionBadges = (permissions: string | number | string[]) => {
    const permissionArray = ensureStringArray(permissions);
    
    return permissionArray.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">
        {permissionArray.map((permission) => (
          <Badge 
            key={permission}
            className={`${permissionColors[permission] || 'bg-gray-100 text-gray-800'}`}
          >
            {permission}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 mt-2">No permissions granted</p>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Permissions for {level.name}
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
              const permissionKey = `${module}Permissions` as keyof AdminLevelDetailed;
              const permissionArray = ensureStringArray(level[permissionKey]);
              
              return (
                <TabsContent key={module} value={module} className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium">
                      {moduleLabels[module]} Permissions
                    </h3>
                    
                    {renderPermissionBadges(level[permissionKey])}
                    
                    <div className="mt-4 text-sm">
                      <h4 className="font-medium mb-2">What this means:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {permissionArray.includes('view') && (
                          <li>Can view {module.toLowerCase()}s in the system</li>
                        )}
                        {permissionArray.includes('add') && (
                          <li>Can create new {module.toLowerCase()}s</li>
                        )}
                        {permissionArray.includes('edit') && (
                          <li>Can edit existing {module.toLowerCase()}s</li>
                        )}
                        {permissionArray.includes('delete') && (
                          <li>Can delete {module.toLowerCase()}s from the system</li>
                        )}
                        {permissionArray.length === 0 && (
                          <li>No access to {module.toLowerCase()} functionality</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPermissionsDialog;
