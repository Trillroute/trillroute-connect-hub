
import { AdminLevel } from "./types";

/**
 * Default roles to use when server roles are not available
 */
export const FALLBACK_ADMIN_ROLES: { [key: string]: AdminLevel } = {
  "SuperAdmin": {
    name: "SuperAdmin",
    level: 100,
    description: "Complete administrative access",
    studentPermissions: ['view', 'add', 'edit', 'delete'],
    teacherPermissions: ['view', 'add', 'edit', 'delete'],
    adminPermissions: ['view', 'add', 'edit', 'delete'],
    leadPermissions: ['view', 'add', 'edit', 'delete'],
    coursePermissions: ['view', 'add', 'edit', 'delete'],
    levelPermissions: ['view', 'add', 'edit', 'delete']
  },
  "Administrator": {
    name: "Administrator",
    level: 90,
    description: "Full administrative access except admin management",
    studentPermissions: ['view', 'add', 'edit', 'delete'],
    teacherPermissions: ['view', 'add', 'edit', 'delete'],
    adminPermissions: ['view'],
    leadPermissions: ['view', 'add', 'edit', 'delete'],
    coursePermissions: ['view', 'add', 'edit', 'delete'],
    levelPermissions: ['view']
  },
  "Manager": {
    name: "Manager",
    level: 80,
    description: "Can manage students, teachers and courses",
    studentPermissions: ['view', 'add', 'edit', 'delete'],
    teacherPermissions: ['view', 'add', 'edit', 'delete'],
    adminPermissions: ['view'],
    leadPermissions: ['view', 'add', 'edit'],
    coursePermissions: ['view', 'add', 'edit'],
    levelPermissions: []
  },
  "Content Manager": {
    name: "Content Manager",
    level: 70,
    description: "Can manage courses and content",
    studentPermissions: ['view'],
    teacherPermissions: ['view'],
    adminPermissions: [],
    leadPermissions: ['view'],
    coursePermissions: ['view', 'add', 'edit', 'delete'],
    levelPermissions: []
  },
  "Lead Manager": {
    name: "Lead Manager",
    level: 60,
    description: "Can manage leads and basic student data",
    studentPermissions: ['view'],
    teacherPermissions: [],
    adminPermissions: [],
    leadPermissions: ['view', 'add', 'edit', 'delete'],
    coursePermissions: ['view'],
    levelPermissions: []
  },
  "Limited View": {
    name: "Limited View",
    level: 10,
    description: "Can view basic information",
    studentPermissions: ['view'],
    teacherPermissions: ['view'],
    adminPermissions: [],
    leadPermissions: [],
    coursePermissions: ['view'],
    levelPermissions: []
  }
};
