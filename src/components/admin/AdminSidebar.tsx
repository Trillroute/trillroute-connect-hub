
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  UserPlus, 
  Puzzle, 
  Menu as MenuIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

import SidebarHeader from './SidebarHeader';
import SidebarMenuSection, { SidebarItem } from './SidebarMenuSection';
import SidebarFooter from './SidebarFooter';

export type ActiveTab =
  | "courses"
  | "classTypes"
  | "students"
  | "enrollStudents"
  | "teachers"
  | "admins"
  | "leads"
  | "levels";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
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

const sidebarItems: SidebarItem[] = [
  { key: 'courses', icon: BookOpen, label: 'Courses', permissionKey: 'courses' },
  { key: 'classTypes', icon: Puzzle, label: 'Class Types', permissionKey: 'classTypes' },
  { key: 'students', icon: Users, label: 'Students', permissionKey: 'students' },
  { key: 'enrollStudents', icon: Users, label: 'Enroll Students', permissionKey: 'students' },
  { key: 'teachers', icon: GraduationCap, label: 'Teachers', permissionKey: 'teachers' },
  { key: 'admins', icon: ShieldCheck, label: 'Admins', permissionKey: 'admins' },
  { key: 'leads', icon: UserPlus, label: 'Leads', permissionKey: 'leads' },
  { key: 'levels', icon: MenuIcon, label: 'Levels', permissionKey: 'levels' },
];

const AdminSidebar = ({
  collapsed,
  onToggleCollapse,
  activeTab,
  onTabChange,
  permissionMap
}: AdminSidebarProps) => (
  <Sidebar className={cn(
    "border-r border-gray-200 h-[calc(100vh-4rem)] transition-all duration-300 bg-white relative flex flex-col",
    collapsed ? "w-16" : "w-64"
  )}>
    <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    <SidebarMenuSection
      items={sidebarItems}
      collapsed={collapsed}
      activeTab={activeTab}
      onTabChange={onTabChange}
      permissionMap={permissionMap}
    />
    <SidebarFooter collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
  </Sidebar>
);

export default AdminSidebar;
