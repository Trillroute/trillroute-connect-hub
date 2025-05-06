
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import StudentManagement from '@/components/admin/StudentManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import LimitedAccessCard from './LimitedAccessCard';
import { type ActiveTab } from '../AdminSidebar';

interface DashboardContentProps {
  activeTab: ActiveTab;
  permissionMap: {
    students: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    teachers: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    admins: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    leads: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    courses: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    levels: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  };
  hasAnyAccess: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab, 
  permissionMap,
  hasAnyAccess 
}) => {
  return (
    <div className="space-y-6">
      {activeTab === 'teachers' && permissionMap.teachers.view && (
        <div className="mb-4">
          <Link 
            to="/admin/teacher-registration" 
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-music-500 text-white hover:bg-music-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-music-500 focus-visible:ring-offset-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Teacher
          </Link>
        </div>
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

      {!hasAnyAccess && <LimitedAccessCard />}
    </div>
  );
};

export default DashboardContent;
