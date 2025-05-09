
export interface AdminLevelBasic {
  id: number;
  name: string;
  description: string;
}

export interface AdminLevelDetailed extends AdminLevelBasic {
  studentPermissions: string[];
  teacherPermissions: string[];
  adminPermissions: string[];
  leadPermissions: string[];
  coursePermissions: string[];
  levelPermissions: string[];
  eventsPermissions: string[];
  classTypesPermissions: string[];
  userAvailabilityPermissions: string[];
}

export type PermissionModuleType = 'student' | 'teacher' | 'admin' | 'lead' | 'course' | 'level' | 'event' | 'classType' | 'userAvailability';
export type PermissionActionType = 'view' | 'add' | 'edit' | 'delete';
