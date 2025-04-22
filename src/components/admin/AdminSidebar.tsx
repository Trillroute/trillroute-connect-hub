
import React, { useState, useRef } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  UserPlus, 
  Puzzle, 
  Menu as MenuIcon, 
  ChevronRight, 
  ChevronLeft, 
  Move 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  permissionMap: {
    courses?: { view: boolean };
    classTypes?: { view: boolean };
    students?: { view: boolean };
    teachers?: { view: boolean };
    admins?: { view: boolean };
    leads?: { view: boolean };
    levels?: { view: boolean };
  };
}

type SidebarItem = {
  key: string;
  icon: any;
  label: string;
  permissionKey: keyof AdminSidebarProps['permissionMap'];
};

const sidebarItems: SidebarItem[] = [
  { key: 'courses', icon: BookOpen, label: 'Courses', permissionKey: 'courses' },
  { key: 'classTypes', icon: Puzzle, label: 'Class Types', permissionKey: 'classTypes' },
  { key: 'students', icon: Users, label: 'Students', permissionKey: 'students' },
  { key: 'teachers', icon: GraduationCap, label: 'Teachers', permissionKey: 'teachers' },
  { key: 'admins', icon: ShieldCheck, label: 'Admins', permissionKey: 'admins' },
  { key: 'leads', icon: UserPlus, label: 'Leads', permissionKey: 'leads' },
  { key: 'levels', icon: MenuIcon, label: 'Levels', permissionKey: 'levels' },
];

const AdminSidebar = ({
  collapsed, 
  onToggleCollapse, 
  activeTab, 
  onTabChange,
  permissionMap 
}: AdminSidebarProps) => {
  // For ordering the sidebar nav items
  const [itemsOrder, setItemsOrder] = useState(() =>
    sidebarItems
      .filter(item => permissionMap[item.permissionKey]?.view)
      .map(item => item.key)
  );
  // DnD drag state
  const draggingIndex = useRef<number | null>(null);

  // Handle drag start
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

  // Compute final items to show, in current order
  const visibleItems = itemsOrder
    .map(key => sidebarItems.find(i => i.key === key)!)
    .filter(item => permissionMap[item.permissionKey]?.view);

  return (
    <Sidebar className={cn(
      "border-r border-gray-200 h-screen transition-all duration-300 bg-white relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
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
        <SidebarContent className="flex-1">
          <SidebarMenu>
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
                  draggingIndex.current === idx
                    ? "bg-music-50"
                    : ""
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
                          <Move className="h-4 w-4 text-gray-400 mr-1 cursor-move" />
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
        </SidebarContent>
        <div className="p-2 border-t border-gray-200">
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
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;

