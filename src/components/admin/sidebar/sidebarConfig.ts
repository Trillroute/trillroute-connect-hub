
import { AdminPermission } from "@/utils/permissions/types";
import { 
  Activity, 
  BarChart, 
  Book, 
  Calendar, 
  DollarSign, 
  Flag, 
  Home, 
  Lock, 
  MessageSquare, 
  UserPlus, 
  Users 
} from "lucide-react";
import { ElementType } from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  value?: string;
  icon: ElementType;
  requiredPermission?: AdminPermission;
  submenu?: {
    id: string;
    label: string;
    value: string;
    requiredPermission?: AdminPermission;
  }[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    id: "today",
    label: "Today",
    value: "today",
    icon: Home,
  },
  {
    id: "students",
    label: "Students",
    value: "students",
    icon: Users,
    requiredPermission: AdminPermission.VIEW_STUDENTS
  },
  {
    id: "courses",
    label: "Courses",
    icon: Book,
    submenu: [
      {
        id: "classTypes",
        label: "Class Types",
        value: "classTypes",
      },
      {
        id: "courseManagement",
        label: "Course Management",
        value: "courseManagement",
      },
    ],
  },
  {
    id: "fees",
    label: "Fees",
    value: "fees",
    icon: DollarSign,
  },
  {
    id: "communication",
    label: "Communication",
    value: "communication",
    icon: MessageSquare,
  },
  {
    id: "leads",
    label: "Leads",
    icon: Activity,
    submenu: [
      {
        id: "leads",
        label: "Leads Table",
        value: "leads",
      },
      {
        id: "leads-cards",
        label: "Leads Cards",
        value: "leads-cards",
      },
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    icon: Calendar,
    submenu: [
      {
        id: "calendar",
        label: "Calendar",
        value: "scheduling",
      },
      {
        id: "user-availability",
        label: "User Availability",
        value: "user-availability",
      },
    ],
  },
  {
    id: "teachers",
    label: "Teachers",
    value: "teachers",
    icon: UserPlus,
    requiredPermission: AdminPermission.VIEW_TEACHERS
  },
  {
    id: "intramural",
    label: "Intramural",
    value: "intramural",
    icon: Flag,
  },
  {
    id: "reports",
    label: "Reports",
    value: "reports",
    icon: BarChart,
  },
  {
    id: "access",
    label: "Access",
    icon: Lock,
    submenu: [
      {
        id: "admins",
        label: "Admins",
        value: "admins",
        requiredPermission: AdminPermission.VIEW_ADMINS
      },
      {
        id: "levels",
        label: "Levels",
        value: "levels",
        requiredPermission: AdminPermission.VIEW_LEVELS
      },
      // Removed the "Access Control" option here
    ],
  },
];
