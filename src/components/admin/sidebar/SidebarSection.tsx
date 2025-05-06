
import React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenuItem as SidebarMenuItemType } from "./sidebarConfig";
import { ActiveTab } from "../SuperAdminSidebar";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  items: SidebarMenuItemType[];
  activeTab: string;
  onTabChange: (tab: ActiveTab) => void;
  openSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  items,
  activeTab,
  onTabChange,
  openSubmenus,
  toggleSubmenu
}) => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          {item.submenu ? (
            <div className="flex flex-col w-full">
              <div 
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-md cursor-pointer transition-colors",
                  (item.submenu.some(subitem => subitem.value === activeTab) || item.value === activeTab)
                    ? "bg-music-100 text-music-600"
                    : "hover:bg-gray-100"
                )}
                onClick={() => toggleSubmenu(item.id)}
              >
                <span className="mr-3 flex items-center">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="flex-grow">{item.label}</span>
                {openSubmenus[item.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
              
              {openSubmenus[item.id] && (
                <SidebarMenuSub>
                  {item.submenu.map((subitem) => (
                    <SidebarMenuItem key={subitem.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(subitem.value as ActiveTab)}
                        className={cn(
                          "flex items-center w-full",
                          activeTab === subitem.value
                            ? "bg-music-50 text-music-600 font-medium"
                            : ""
                        )}
                        isActive={activeTab === subitem.value}
                      >
                        <span>{subitem.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenuSub>
              )}
            </div>
          ) : (
            <SidebarMenuButton
              onClick={() => onTabChange(item.value as ActiveTab)}
              className={cn(
                "flex items-center w-full",
                activeTab === item.value ? "bg-music-100 text-music-600" : ""
              )}
              isActive={activeTab === item.value}
            >
              <span className="mr-3 flex items-center">
                <item.icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarSection;
