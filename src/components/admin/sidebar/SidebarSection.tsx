
import React from "react";
import {
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarMenuItem from "./SidebarMenuItem";
import { ActiveTab } from "../SuperAdminSidebar";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  submenuItems?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
  }>;
}

interface SidebarSectionProps {
  items: MenuItem[];
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  openSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  items,
  activeTab,
  onTabChange,
  openSubmenus,
  toggleSubmenu,
}) => {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const hasSubmenu = item.submenuItems && item.submenuItems.length > 0;
        const isSubmenuActive = hasSubmenu && item.submenuItems?.some(
          (subItem) => activeTab === subItem.id as ActiveTab
        );

        return (
          <SidebarMenuItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            isSubmenuActive={isSubmenuActive}
            onClick={onTabChange}
            submenuItems={item.submenuItems?.map((subItem) => ({
              ...subItem,
              isActive: activeTab === subItem.id as ActiveTab,
            }))}
            onSubmenuToggle={() => toggleSubmenu(item.id)}
            isOpen={openSubmenus[item.id]}
          />
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarSection;
