
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import SidebarSection from "./sidebar/SidebarSection";
import { sidebarMenuItems } from "./sidebar/sidebarConfig";

export type ActiveTab =
  | "today"
  | "students"
  | "courses"
  | "classTypes"
  | "fees"
  | "communication"
  | "leads"
  | "leads-cards"
  | "scheduling"
  | "teachers"
  | "intramural"
  | "reports"
  | "access"
  | "admins"
  | "levels"
  | "courseManagement";

interface SuperAdminSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ activeTab, onTabChange }) => {
  // Track open state of each submenu
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    courses: activeTab === 'classTypes' || activeTab === 'courseManagement' || activeTab === 'courses',
    access: activeTab === 'admins' || activeTab === 'levels' || activeTab === 'access',
    leads: activeTab === 'leads' || activeTab === 'leads-cards',
  });

  const location = useLocation();

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Sidebar className="border-r border-gray-200 h-full bg-white w-56 flex-shrink-0">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarSection 
            items={sidebarMenuItems}
            activeTab={activeTab}
            onTabChange={onTabChange}
            openSubmenus={openSubmenus}
            toggleSubmenu={toggleSubmenu}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
