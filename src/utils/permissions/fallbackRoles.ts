
import { AdminLevel } from "./types";

// Fallback permissions mapping in case we can't fetch from database
export const FALLBACK_ADMIN_ROLES: Record<string, AdminLevel> = {
  "Limited View": {
    name: "Limited View",
    description: "Limited view-only access",
    studentPermissions: ["view"],
    teacherPermissions: ["view"],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ["view"],
    levelPermissions: []
  },
  "SuperAdmin": {
    name: "SuperAdmin",
    description: "Full access to all features",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view", "add", "edit", "delete"]
  },
  "Super Admin": {
    name: "Super Admin",
    description: "Full access to all features",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view", "add", "edit", "delete"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view", "add", "edit", "delete"]
  },
  "Upper Manager": {
    name: "Upper Manager",
    description: "Management access",
    studentPermissions: ["view", "add", "edit", "delete"],
    teacherPermissions: ["view", "add", "edit", "delete"],
    adminPermissions: ["view"],
    leadPermissions: ["view", "add", "edit", "delete"],
    coursePermissions: ["view", "add", "edit", "delete"],
    levelPermissions: ["view"]
  }
};
