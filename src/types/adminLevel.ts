
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
}

export type PermissionModuleType = 'student' | 'teacher' | 'admin' | 'lead' | 'course' | 'level';
export type PermissionActionType = 'view' | 'add' | 'edit' | 'delete';
