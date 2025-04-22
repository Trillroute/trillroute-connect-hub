
import React from "react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, BookOpen, PlusCircle, School, GraduationCap, Shield, UserPlus, Settings } from "lucide-react";

type ActiveTab = 'today' | 'courses' | 'classTypes' | 'students' | 'teachers' | 'admins' | 'leads' | 'levels';

const NAV_ITEMS: {
  key: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'today', label: 'Today', icon: LayoutDashboard },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'classTypes', label: 'Class Types', icon: PlusCircle },
  { key: 'students', label: 'Students', icon: School },
  { key: 'teachers', label: 'Teachers', icon: GraduationCap },
  { key: 'admins', label: 'Admins', icon: Shield },
  { key: 'leads', label: 'Leads', icon: UserPlus },
  { key: 'levels', label: 'Levels', icon: Settings },
];

interface SuperAdminSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ activeTab, onTabChange }) => (
  <Sidebar className="border-r border-gray-200 h-full bg-white w-56 flex-shrink-0">
    <SidebarContent className="pt-12">
      <div className="mb-4 px-3">
        <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
      </div>
      <SidebarMenu>
        {NAV_ITEMS.map((item) => (
          <SidebarMenuItem key={item.key}>
            <SidebarMenuButton
              isActive={activeTab === item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex items-center gap-2 ${
                activeTab === item.key
                  ? 'bg-music-100 text-music-600 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
);

export default SuperAdminSidebar;
