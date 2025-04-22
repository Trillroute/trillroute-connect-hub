
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  UserPlus, 
  Puzzle, 
  Menu, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  permissionMap: {
    courses?: { view: boolean };
    classTypes?: { view: boolean };
    students?: { view: boolean };
    teachers?: { view: boolean };
    admins?: { view: boolean };
    leads?: { view: boolean };
    levels?: { view: boolean };
  };
}

const AdminSidebar = ({ 
  collapsed, 
  onToggleCollapse, 
  activeTab, 
  onTabChange,
  permissionMap 
}: AdminSidebarProps) => {
  // Completely removed renderBreadcrumbs and all breadcrumb rendering.

  return (
    <Sidebar className={cn(
      "border-r border-gray-200 h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && <span className="font-semibold text-lg text-music-600">Admin Panel</span>}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            {permissionMap.courses?.view && (
              <MenuItem 
                icon={BookOpen} 
                label="Courses" 
                active={activeTab === 'courses'} 
                onClick={() => onTabChange('courses')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.classTypes?.view && (
              <MenuItem 
                icon={Puzzle} 
                label="Class Types" 
                active={activeTab === 'classTypes'} 
                onClick={() => onTabChange('classTypes')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.students?.view && (
              <MenuItem 
                icon={Users} 
                label="Students" 
                active={activeTab === 'students'} 
                onClick={() => onTabChange('students')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.teachers?.view && (
              <MenuItem 
                icon={GraduationCap} 
                label="Teachers" 
                active={activeTab === 'teachers'} 
                onClick={() => onTabChange('teachers')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.admins?.view && (
              <MenuItem 
                icon={ShieldCheck} 
                label="Admins" 
                active={activeTab === 'admins'} 
                onClick={() => onTabChange('admins')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.leads?.view && (
              <MenuItem 
                icon={UserPlus} 
                label="Leads" 
                active={activeTab === 'leads'} 
                onClick={() => onTabChange('leads')}
                collapsed={collapsed}
              />
            )}
            {permissionMap.levels?.view && (
              <MenuItem 
                icon={Menu} 
                label="Levels" 
                active={activeTab === 'levels'} 
                onClick={() => onTabChange('levels')}
                collapsed={collapsed}
              />
            )}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
};

const MenuItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) => (
  <SidebarMenuItem>
    <TooltipProvider disableHoverableContent={!collapsed}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            onClick={onClick}
            className={cn(
              "flex items-center w-full p-3 rounded-md transition-colors",
              active 
                ? "bg-music-100 text-music-600" 
                : "hover:bg-gray-100"
            )}
          >
            <Icon className="h-5 w-5 mr-3" />
            {!collapsed && <span>{label}</span>}
          </SidebarMenuButton>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  </SidebarMenuItem>
);

export default AdminSidebar;
