
import { AdminPermission } from "@/utils/permissions";
import { 
  Activity, 
  BarChart, 
  Book, 
  Calendar, 
  DollarSign, 
  Flag, 
  Home, 
  MessageSquare, 
  Shield, 
  ShieldCheck,
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
        id: "courses",
        label: "Courses",
        value: "courses",
      },
      {
        id: "classTypes",
        label: "Class Types",
        value: "classTypes",
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
        label: "Leads Kanban",
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
        id: "scheduling",
        label: "Calendar",
        value: "scheduling"
      },
      {
        id: "user-availability",
        label: "User Availability",
        value: "user-availability"
      }
    ]
  },
  {
    id: "teachers",
    label: "Teachers",
    value: "teachers",
    icon: UserPlus,
    requiredPermission: AdminPermission.VIEW_TEACHERS
  },
  {
    id: "access",
    label: "Access Management",
    icon: Shield,
    submenu: [
      {
        id: "admins",
        label: "Administrators",
        value: "admins",
        requiredPermission: AdminPermission.VIEW_ADMINS
      },
      {
        id: "levels",
        label: "Permission Levels",
        value: "levels",
        requiredPermission: AdminPermission.VIEW_LEVELS
      }
    ]
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
];
