
import React from "react";
import {
  SidebarMenuItem as SMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
import { ElementType } from "react";

interface SubMenuItem {
  id: string;
  label: string;
  icon: ElementType;
  isActive: boolean;
}

interface SidebarMenuItemProps {
  id: string;
  label: string;
  icon: ElementType;
  isActive: boolean;
  isSubmenuActive?: boolean;
  onClick: (id: string) => void;
  submenuItems?: SubMenuItem[];
  onSubmenuToggle?: () => void;
  isOpen?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  id,
  label,
  icon: Icon,
  isActive,
  isSubmenuActive,
  onClick,
  submenuItems,
  onSubmenuToggle,
  isOpen = false,
}) => {
  const hasSubmenu = submenuItems && submenuItems.length > 0;
  const isActiveOrHasActiveChild = isActive || isSubmenuActive;
  
  const handleClick = () => {
    if (hasSubmenu && onSubmenuToggle) {
      onSubmenuToggle();
    } else {
      onClick(id);
    }
  };

  return (
    <SMenuItem>
      <SidebarMenuButton
        isActive={isActiveOrHasActiveChild}
        onClick={handleClick}
        className={`
          flex items-center gap-2
          ${isActiveOrHasActiveChild
            ? "bg-music-100 text-music-600 font-semibold"
            : "hover:bg-gray-100"
          }
        `}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </SidebarMenuButton>
      {hasSubmenu && isOpen && (
        <SidebarSubmenu
          items={submenuItems.map((item) => ({
            ...item,
            onClick,
          }))}
        />
      )}
    </SMenuItem>
  );
};

export default SidebarMenuItem;
