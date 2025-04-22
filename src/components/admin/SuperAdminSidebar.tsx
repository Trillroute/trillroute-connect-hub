
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Puzzle,
  DollarSign,
  MessageSquare,
  UserPlus,
  Calendar,
  GraduationCap,
  Users,
  User,
  FileText,
  Shield,
  Settings
} from "lucide-react";

export type ActiveTab =
  | "today"
  | "students"
  | "courses"
  | "classTypes"
  | "fees"
  | "communication"
  | "leads"
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
  // State for submenu open/close (can add more for more submenus)
  const [coursesOpen, setCoursesOpen] = useState(activeTab === 'classTypes' || activeTab === 'courseManagement' || activeTab === 'courses');
  const [accessOpen, setAccessOpen] = useState(activeTab === 'admins' || activeTab === 'levels' || activeTab === 'access');

  return (
    <Sidebar className="border-r border-gray-200 h-full bg-white w-56 flex-shrink-0">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarMenu>
            {/* Today */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "today"}
                onClick={() => onTabChange("today")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "today"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Today</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Students */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "students"}
                onClick={() => onTabChange("students")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "students"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <School className="h-5 w-5" />
                <span>Students</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Courses (Submenu) */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "courses" || activeTab === "classTypes" || activeTab === "courseManagement"}
                onClick={() => setCoursesOpen((open) => !open)}
                className={`
                  flex items-center gap-2
                  ${activeTab === "courses" || activeTab === "classTypes" || activeTab === "courseManagement"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </SidebarMenuButton>
              {coursesOpen && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={activeTab === "classTypes"}
                      onClick={() => onTabChange("classTypes")}
                    >
                      <Puzzle className="h-4 w-4" />
                      <span>Class Type</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={activeTab === "courseManagement"}
                      onClick={() => onTabChange("courseManagement")}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Course Management</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
            {/* Fees */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "fees"}
                onClick={() => onTabChange("fees")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "fees"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <DollarSign className="h-5 w-5" />
                <span>Fees</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Communication */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "communication"}
                onClick={() => onTabChange("communication")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "communication"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Communication</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Leads & Trials */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "leads"}
                onClick={() => onTabChange("leads")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "leads"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <UserPlus className="h-5 w-5" />
                <span>Leads & Trials</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Scheduling */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "scheduling"}
                onClick={() => onTabChange("scheduling")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "scheduling"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <Calendar className="h-5 w-5" />
                <span>Scheduling</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Teachers */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "teachers"}
                onClick={() => onTabChange("teachers")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "teachers"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <GraduationCap className="h-5 w-5" />
                <span>Teachers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Intramural */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "intramural"}
                onClick={() => onTabChange("intramural")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "intramural"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <Users className="h-5 w-5" />
                <span>Intramural</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Reports */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "reports"}
                onClick={() => onTabChange("reports")}
                className={`
                  flex items-center gap-2
                  ${activeTab === "reports"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Access (Submenu) */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "access" || activeTab === "admins" || activeTab === "levels"}
                onClick={() => setAccessOpen((open) => !open)}
                className={`
                  flex items-center gap-2
                  ${activeTab === "access" || activeTab === "admins" || activeTab === "levels"
                    ? "bg-music-100 text-music-600 font-semibold"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <Settings className="h-5 w-5" />
                <span>Access</span>
              </SidebarMenuButton>
              {accessOpen && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={activeTab === "admins"}
                      onClick={() => onTabChange("admins")}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admins</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={activeTab === "levels"}
                      onClick={() => onTabChange("levels")}
                    >
                      <User className="h-4 w-4" />
                      <span>Levels</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
