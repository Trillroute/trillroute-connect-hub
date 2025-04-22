
import React, { useState, useRef } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  key: string;
  icon: any;
  label: string;
  permissionKey: string;
};

interface SidebarMenuSectionProps {
  items: SidebarItem[];
  collapsed: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  permissionMap: Record<string, { view: boolean }>;
}

const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  items,
  collapsed,
  activeTab,
  onTabChange,
  permissionMap,
}) => {
  const [itemsOrder, setItemsOrder] = useState(() =>
    items.filter(item => permissionMap[item.permissionKey]?.view).map(item => item.key)
  );
  const draggingIndex = useRef<number | null>(null);

  const handleDragStart = (idx: number) => {
    draggingIndex.current = idx;
  };
  const handleDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = draggingIndex.current;
    if (from === null || from === idx) return;
    const newOrder = [...itemsOrder];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(idx, 0, moved);
    draggingIndex.current = idx;
    setItemsOrder(newOrder);
  };
  const handleDragEnd = () => {
    draggingIndex.current = null;
  };

  const visibleItems = itemsOrder
    .map(key => items.find(i => i.key === key)!)
    .filter(item => permissionMap[item.permissionKey]?.view);

  return (
    <div className="flex-1 overflow-y-auto">
      <SidebarMenu className="py-2">
        {visibleItems.map((item, idx) => (
          <SidebarMenuItem
            key={item.key}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver(idx)}
            onDragEnd={handleDragEnd}
            onDrop={handleDragEnd}
            aria-label={`Move ${item.label}`}
            className={cn(
              "transition-colors select-none group",
              draggingIndex.current === idx ? "bg-music-50" : ""
            )}
            style={{
              cursor: "grab",
              opacity: draggingIndex.current === idx ? 0.5 : 1
            }}
          >
            <TooltipProvider disableHoverableContent={!collapsed}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.key)}
                    className={cn(
                      "flex items-center w-full p-3 rounded-md transition-colors",
                      activeTab === item.key
                        ? "bg-music-100 text-music-600"
                        : "hover:bg-gray-100"
                    )}
                    isActive={activeTab === item.key}
                    aria-current={activeTab === item.key ? "page" : undefined}
                  >
                    <span className="mr-3 flex items-center">
                      <item.icon className="h-5 w-5" />
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
};

export default SidebarMenuSection;
