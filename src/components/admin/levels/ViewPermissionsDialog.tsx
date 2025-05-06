
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLevelDetailed, PermissionModuleType } from '@/types/adminLevel';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const modulePermissions: Record<PermissionModuleType, string[]> = {
    student: level.studentPermissions || [],
    teacher: level.teacherPermissions || [],
    admin: level.adminPermissions || [],
    lead: level.leadPermissions || [],
    course: level.coursePermissions || [],
    level: level.levelPermissions || [],
  };

  const permissionOptions = ['view', 'add', 'edit', 'delete'];

  const renderPermissionStatus = (module: PermissionModuleType, permission: string) => {
    const hasPermission = modulePermissions[module].includes(permission);

    return hasPermission ? (
      <div className="flex items-center text-green-600">
        <Check className="h-4 w-4 mr-1" />
        <span>Yes</span>
      </div>
    ) : (
      <div className="flex items-center text-gray-400">
        <X className="h-4 w-4 mr-1" />
        <span>No</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Permissions for {level.name}
            <Badge variant="outline" className="ml-2">
              ID: {level.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <Tabs defaultValue="student">
            <TabsList className="mb-4">
              {Object.keys(moduleLabels).map((module) => (
                <TabsTrigger key={module} value={module}>
                  {moduleLabels[module as PermissionModuleType]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(moduleLabels).map((moduleKey) => {
              const module = moduleKey as PermissionModuleType;
              
              return (
                <TabsContent key={module} value={module}>
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">
                      {moduleLabels[module]} Permissions
                    </h3>
                    <div className="space-y-3">
                      {permissionOptions.map((permission) => (
                        <div
                          key={permission}
                          className="flex justify-between items-center p-2 border-b last:border-b-0"
                        >
                          <div className="capitalize">
                            {permission} {moduleLabels[module].toLowerCase().replace(' management', '')}
                          </div>
                          {renderPermissionStatus(module, permission)}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPermissionsDialog;
