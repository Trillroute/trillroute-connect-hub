
import { AdminLevelDetailed } from '@/types/adminLevel';
import { AdminLevel } from './types';

/**
 * Converts AdminLevelDetailed to AdminLevel
 */
export const convertToAdminLevel = (levelDetailed: AdminLevelDetailed): AdminLevel => {
  return {
    id: levelDetailed.id,
    name: levelDetailed.name,
    level: levelDetailed.level || levelDetailed.id, // Use level if available, otherwise use id
    description: levelDetailed.description,
    studentPermissions: levelDetailed.studentPermissions,
    teacherPermissions: levelDetailed.teacherPermissions,
    adminPermissions: levelDetailed.adminPermissions,
    leadPermissions: levelDetailed.leadPermissions,
    coursePermissions: levelDetailed.coursePermissions,
    levelPermissions: levelDetailed.levelPermissions,
    eventsPermissions: levelDetailed.eventsPermissions,
    classTypesPermissions: levelDetailed.classTypesPermissions,
    userAvailabilityPermissions: levelDetailed.userAvailabilityPermissions
  };
};

/**
 * Converts array of AdminLevelDetailed to array of AdminLevel
 */
export const convertToAdminLevels = (levelsDetailed: AdminLevelDetailed[]): AdminLevel[] => {
  return levelsDetailed.map(convertToAdminLevel);
};
