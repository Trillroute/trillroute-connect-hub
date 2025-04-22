
import React from 'react';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  // Only allowed icons per system instruction:
  ArrowLeft, 
  ArrowRight, 
  Menu, 
  User
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

// Add your logo
const LOGO_URL = "https://static.wixstatic.com/media/7ce495_c7aa45068c7743e7b27d8d4fe92499d0~mv2.png";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const MENU_ITEMS = [
  { key: 'courses', label: 'Courses', icon: Menu, canView: (pm: any) => pm.courses?.view },
  { key: 'classTypes', label: 'Class Types', icon: Menu, canView: (pm: any) => pm.classTypes?.view },
  { key: 'students', label: 'Students', icon: Menu, canView: (pm: any) => pm.students?.view },
  { key: 'teachers', label: 'Teachers', icon: Menu, canView: (pm: any) => pm.teachers?.view },
  { key: 'admins', label: 'Admins', icon: Menu, canView: (pm: any) => pm.admins?.view },
  { key: 'leads', label: 'Leads', icon: Menu, canView: (pm: any) => pm.leads?.view },
  { key: 'levels', label: 'Levels', icon: Menu, canView: (pm: any) => pm.levels?.view },
];

const AdminSidebar = ({
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) => {
  const { user } = useAuth();
  // Assume active tab and permissionMap come from route or context
  const [activeTab, setActiveTab] = React.useState('courses');
  // TODO: permissionMap should come from props/context
  // For demonstration, allow all:
  const permissionMap = {
    courses: { view: true },
    classTypes: { view: true },
    students: { view: true },
    teachers: { view: true },
    admins: { view: true },
    leads: { view: true },
    levels: { view: true },
  };

  return (
    <Sidebar
      variant="floating"
      collapsible={collapsed ? "icon" : "none"}
      className="h-full min-h-screen bg-sidebar border-r border-sidebar-border"
    >
      {/* Logo/Header */}
      <SidebarHeader className="flex items-center justify-center py-4 px-0 mb-2">
        <img
          src={LOGO_URL}
          alt="Logo"
          className={`
            transition-all duration-300
            ${collapsed ? 'w-8 h-8' : 'w-32 h-10'}
            object-contain
          `}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {MENU_ITEMS.filter(item => item.canView(permissionMap)).map(item => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                isActive={activeTab === item.key}
                onClick={() => setActiveTab(item.key)}
                tooltip={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 flex flex-col items-center justify-center">
          {!collapsed && (
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 mr-2 text-sidebar-foreground" />
              <span className="text-sm font-medium truncate">{user?.email || 'User'}</span>
            </div>
          )}
          {/* Collapse/Expand button */}
          <button
            type="button"
            className="
              w-8 h-8 flex items-center justify-center rounded-full border bg-background text-gray-600 shadow hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all
            "
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
