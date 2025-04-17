
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
      className="h-full min-h-screen transition-all duration-300 hover:w-64 mt-16 pb-16" // Added mt-16 to push down the sidebar and pb-16 for bottom spacing
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-center">
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
                className="flex items-center justify-center md:justify-start"
              >
                <BookOpen className="h-5 w-5 mx-auto md:mx-0 md:mr-2" />
                <span className="hidden md:inline">Courses</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.students.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'students'} 
                onClick={() => onTabChange('students')}
                tooltip="Students"
                className="flex items-center justify-center md:justify-start"
              >
                <School className="h-5 w-5 mx-auto md:mx-0 md:mr-2" />
                <span className="hidden md:inline">Students</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.teachers.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'teachers'} 
                onClick={() => onTabChange('teachers')}
                tooltip="Teachers"
                className="flex items-center justify-center md:justify-start"
              >
                <GraduationCap className="h-5 w-5 mx-auto md:mx-0 md:mr-2" />
                <span className="hidden md:inline">Teachers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.admins.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'admins'} 
                onClick={() => onTabChange('admins')}
                tooltip="Admins"
                className="flex items-center justify-center md:justify-start"
              >
                <Shield className="h-5 w-5 mx-auto md:mx-0 md:mr-2" />
                <span className="hidden md:inline">Admins</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissionMap.leads.view && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'leads'} 
                onClick={() => onTabChange('leads')}
                tooltip="Leads"
                className="flex items-center justify-center md:justify-start"
              >
                <UserPlus className="h-5 w-5 mx-auto md:mx-0 md:mr-2" />
                <span className="hidden md:inline">Leads</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center justify-center md:justify-start">
            <User className="h-5 w-5 mx-auto md:mx-0 md:mr-2 text-sidebar-foreground" />
            <span className="hidden md:inline text-sm font-medium truncate">
              {user?.email || 'User'}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
