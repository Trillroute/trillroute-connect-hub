
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, onToggleCollapse }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    {!collapsed && <span className="font-semibold text-lg text-music-600">Admin Panel</span>}
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleCollapse}
      className="h-8 w-8"
      aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </Button>
  </div>
);

export default SidebarHeader;
