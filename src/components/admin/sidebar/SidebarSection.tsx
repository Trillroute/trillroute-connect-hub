
import React from "react";
import {
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarMenuItem from "./SidebarMenuItem";
import { ActiveTab } from "../SuperAdminSidebar";
import { SidebarMenuItem as SidebarMenuItemType } from "./sidebarConfig";

interface SidebarSectionProps {
  items: SidebarMenuItemType[];
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
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuActive = hasSubmenu && item.submenu?.some(
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
            submenuItems={item.submenu?.map((subItem) => ({
              ...subItem,
              icon: item.icon, // Use parent icon for submenu items
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
