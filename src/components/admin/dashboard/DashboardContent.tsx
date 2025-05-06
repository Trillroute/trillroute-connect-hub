
import React from 'react';
import { ActiveTab } from '@/hooks/useAdminDashboardPermissions';
import { AdminPermissionMap } from './PermissionMap';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import TeacherRegistrationLink from './TeacherRegistrationLink';
import NoAccessMessage from './NoAccessMessage';
import DebugInfo from './DebugInfo';
import LoadingPermissions from './LoadingPermissions';

interface DashboardContentProps {
  activeTab: ActiveTab;
  permissionMap: AdminPermissionMap;
  isLoadingRoles: boolean;
  debugInfo: string | null;
  hasAnyAccess: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  permissionMap,
  isLoadingRoles,
  debugInfo,
  hasAnyAccess
}) => {
  if (isLoadingRoles) {
    return <LoadingPermissions />;
  }

  if (!hasAnyAccess) {
    return <NoAccessMessage />;
  }

  return (
    <div className="space-y-6">
      <DebugInfo message={debugInfo || ''} />
      
      {activeTab === 'teachers' && permissionMap.teachers.view && (
        <TeacherRegistrationLink />
      )}
      
      {activeTab === 'courses' && permissionMap.courses.view && (
        <CourseManagement 
          canAddCourse={permissionMap.courses.add}
          canEditCourse={permissionMap.courses.edit}
          canDeleteCourse={permissionMap.courses.delete}
        />
      )}
      
      {activeTab === 'students' && permissionMap.students.view && (
        <StudentManagement 
          canAddUser={permissionMap.students.add}
          canEditUser={permissionMap.students.edit}
          canDeleteUser={permissionMap.students.delete}
        />
      )}
      
      {activeTab === 'teachers' && permissionMap.teachers.view && (
        <TeacherManagement 
          canAddUser={permissionMap.teachers.add}
          canEditUser={permissionMap.teachers.edit}
          canDeleteUser={permissionMap.teachers.delete}
        />
      )}
      
      {activeTab === 'admins' && permissionMap.admins.view && (
        <AdminManagement 
          canAddAdmin={permissionMap.admins.add}
          canEditAdmin={permissionMap.admins.edit}
          canDeleteAdmin={permissionMap.admins.delete}
          canEditAdminLevel={permissionMap.admins.edit}
        />
      )}
      
      {activeTab === 'leads' && permissionMap.leads.view && (
        <LeadManagement 
          canAddLead={permissionMap.leads.add}
          canEditLead={permissionMap.leads.edit}
          canDeleteLead={permissionMap.leads.delete}
        />
      )}
      
      {activeTab === 'levels' && permissionMap.levels.view && (
        <LevelManagement 
          canAddLevel={permissionMap.levels.add}
          canEditLevel={permissionMap.levels.edit}
          canDeleteLevel={permissionMap.levels.delete}
        />
      )}
    </div>
  );
};

export default DashboardContent;
