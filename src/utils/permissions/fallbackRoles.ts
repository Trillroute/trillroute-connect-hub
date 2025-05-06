
import { AdminLevel } from './types';

/**
 * Default admin roles as fallback if the database is unavailable
 */
export const FALLBACK_ADMIN_ROLES: Record<string, AdminLevel> = {
  "Limited View": {
    name: "Limited View",
    description: "View-only administrator",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"],
    levelPermissions: []
  },
  "Standard Admin": {
    name: "Standard Admin",
    description: "Regular administrator permissions",
    studentPermissions: ["view", "add", "edit"],
    teacherPermissions: ["view", "add"],
    adminPermissions: [],
    leadPermissions: ["view", "add", "edit"],
    coursePermissions: ["view", "edit"],
    levelPermissions: ["view"]
  },
  "Full Access": {
    name: "Full Access",
    description: "Complete administrative access",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view", "add", "edit", "delete"]
  },
  "Super Admin": {
    name: "Super Admin",
    description: "Complete system access",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view", "add", "edit", "delete"]
  }
};
