
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdminLevelDetailed, PermissionModuleType } from '@/types/adminLevel';
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
  const moduleLabels: Record<PermissionModuleType, string> = {
    student: 'Student Management',
    teacher: 'Teacher Management',
    admin: 'Admin Management',
    lead: 'Lead Management',
    course: 'Course Management',
    level: 'Level Management',
  };

  if (!level) return null;

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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Permissions for {level.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <Tabs defaultValue="student">
            <div className="overflow-x-auto mb-4">
              <TabsList className="w-full flex flex-wrap bg-gray-100 p-1">
                {Object.keys(moduleLabels).map((module) => (
                  <TabsTrigger
                    key={module}
                    value={module}
                    className="flex-1 min-w-[180px] py-2 text-sm whitespace-nowrap"
                  >
                    {moduleLabels[module as PermissionModuleType]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {Object.keys(moduleLabels).map((moduleKey) => {
              const module = moduleKey as PermissionModuleType;
              const permissionKey = `${module}Permissions` as keyof typeof level;
              const permissions = level[permissionKey] as string[];
              
              return (
                <TabsContent key={module} value={module}>
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">
                      {moduleLabels[module]} Permissions
                    </h3>
                    <div className="space-y-3">
                      {permissions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No permissions assigned.</p>
                      ) : (
                        renderPermissionBadges(permissions, moduleLabels[module])
                      )}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPermissionsDialog;
