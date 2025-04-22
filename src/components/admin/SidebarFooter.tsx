
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, onToggleCollapse }) => (
  <div className="p-2 border-t border-gray-200 mt-auto">
    <Button
      variant="outline"
      size="sm"
      className="w-full flex justify-center items-center"
      onClick={onToggleCollapse}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      tabIndex={0}
    >
      {collapsed ? (
        <>
          <ChevronRight className="h-4 w-4 mr-1" /> Expand
        </>
      ) : (
        <>
          <ChevronLeft className="h-4 w-4 mr-1" /> Minimize
        </>
      )}
    </Button>
  </div>
);

export default SidebarFooter;
