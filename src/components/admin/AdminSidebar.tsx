
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
      className="h-full min-h-screen transition-all duration-300 hover:w-64"
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center">
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
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
              >
                <BookOpen className="h-5 w-5 mr-2" />
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
              >
                <School className="h-5 w-5 mr-2" />
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
              >
                <GraduationCap className="h-5 w-5 mr-2" />
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
              >
                <Shield className="h-5 w-5 mr-2" />
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
              >
                <UserPlus className="h-5 w-5 mr-2" />
                <span>Leads</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-sidebar-foreground" />
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
