
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { BookOpen, School, GraduationCap, Shield, UserPlus, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  permissionMap: {
    courses: { view: boolean };
    students: { view: boolean };
    teachers: { view: boolean };
    admins: { view: boolean };
    leads: { view: boolean };
  };
}

const AdminSidebar = ({ activeTab, onTabChange, permissionMap }: AdminSidebarProps) => {
  const { user } = useAuth();
  
  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="h-full min-h-screen transition-all duration-300 hover:w-64 mt-16 mb-16 py-16"
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {permissionMap.courses.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'courses'} 
                onClick={() => onTabChange('courses')}
                tooltip="Courses"
                className="flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <BookOpen className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span>Courses</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.students.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'students'} 
                onClick={() => onTabChange('students')}
                tooltip="Students"
                className="flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <School className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span>Students</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.teachers.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'teachers'} 
                onClick={() => onTabChange('teachers')}
                tooltip="Teachers"
                className="flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <GraduationCap className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span>Teachers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.admins.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'admins'} 
                onClick={() => onTabChange('admins')}
                tooltip="Admins"
                className="flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <Shield className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span>Admins</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.leads.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'leads'} 
                onClick={() => onTabChange('leads')}
                tooltip="Leads"
                className="flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span>Leads</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center group-data-[collapsible=icon]:justify-center">
            <User className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0 text-sidebar-foreground" />
            <span className="text-sm font-medium truncate">
              {user?.email || 'User'}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
