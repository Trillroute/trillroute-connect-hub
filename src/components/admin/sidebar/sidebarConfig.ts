
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
  Settings,
  Kanban
} from "lucide-react";
import { ActiveTab } from "../SuperAdminSidebar";

export interface MenuItemConfig {
  id: ActiveTab | string;
  label: string;
  icon: React.ElementType;
  submenuItems?: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }>;
}

export const sidebarMenuItems: MenuItemConfig[] = [
  {
    id: "today",
    label: "Today",
    icon: LayoutDashboard,
  },
  {
    id: "students",
    label: "Students",
    icon: School,
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    submenuItems: [
      {
        id: "classTypes",
        label: "Class Type",
        icon: Puzzle,
      },
      {
        id: "courseManagement",
        label: "Course Management",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "fees",
    label: "Fees",
    icon: DollarSign,
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageSquare,
  },
  {
    id: "leads",
    label: "Leads & Trials",
    icon: UserPlus,
    submenuItems: [
      {
        id: "leads",
        label: "Leads",
        icon: UserPlus,
      },
      {
        id: "leads-cards",
        label: "Cards",
        icon: Kanban,
      },
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    icon: Calendar,
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: GraduationCap,
  },
  {
    id: "intramural",
    label: "Intramural",
    icon: Users,
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
  },
  {
    id: "access",
    label: "Access",
    icon: Settings,
    submenuItems: [
      {
        id: "admins",
        label: "Admins",
        icon: Shield,
      },
      {
        id: "levels",
        label: "Levels",
        icon: User,
      },
    ],
  },
];
