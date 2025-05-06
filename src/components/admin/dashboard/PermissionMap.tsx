
import React from 'react';

export interface AdminPermissionMap {
  students: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  teachers: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  admins: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  leads: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  courses: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  levels: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
}

export const getDefaultPermissionMap = (): AdminPermissionMap => ({
  students: { view: false, add: false, edit: false, delete: false },
  teachers: { view: false, add: false, edit: false, delete: false },
  admins: { view: false, add: false, edit: false, delete: false },
  leads: { view: false, add: false, edit: false, delete: false },
  courses: { view: false, add: false, edit: false, delete: false },
  levels: { view: false, add: false, edit: false, delete: false }
});

export const getSuperAdminPermissionMap = (): AdminPermissionMap => ({
  students: { view: true, add: true, edit: true, delete: true },
  teachers: { view: true, add: true, edit: true, delete: true },
  admins: { view: true, add: true, edit: true, delete: true },
  leads: { view: true, add: true, edit: true, delete: true },
  courses: { view: true, add: true, edit: true, delete: true },
  levels: { view: true, add: true, edit: true, delete: true }
});
