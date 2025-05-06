
import { AdminLevel } from './types';

// Default/fallback admin levels when database fetch fails
export const FALLBACK_ADMIN_LEVELS: AdminLevel[] = [
  {
    name: "Limited View",
    description: "View-only administrator",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"],
    levelPermissions: []
  },
  {
    name: "Standard Admin",
    description: "Regular administrator permissions",
    studentPermissions: ["view", "add", "edit"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit"],
    coursePermissions: ["view", "edit"],
    levelPermissions: ["view"]
  },
  {
    name: "Full Access",
    description: "Complete administrative access",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view", "add", "edit", "delete"]
  }
];
