
import React from "react";
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { IconType } from "lucide-react";

interface SidebarSubmenuItemProps {
  label: string;
  id: string;
  icon?: React.ElementType;
  isActive: boolean;
  onClick: (id: string) => void;
}

interface SidebarSubmenuProps {
  items: SidebarSubmenuItemProps[];
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({ items }) => {
  return (
    <SidebarMenuSub>
      {items.map((item) => (
        <SidebarMenuSubItem key={item.id}>
          <SidebarMenuSubButton
            isActive={item.isActive}
            onClick={() => item.onClick(item.id)}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
};

export default SidebarSubmenu;
