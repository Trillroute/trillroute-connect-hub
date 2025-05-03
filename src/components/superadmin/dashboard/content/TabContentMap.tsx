
import React from 'react';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherContent from './TeacherContent';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import ClassTypeManagement from "@/components/admin/class-types/ClassTypeManagement";
import UserActivityReport from "@/components/admin/reports/UserActivityReport";
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';

export const getTabContent = (tab: string): React.ReactNode => {
  const contentMap: Record<string, React.ReactNode> = {
    'courses': <CourseManagement canAddCourse={true} canEditCourse={true} canDeleteCourse={true} />,
    'courseManagement': <CourseManagement canAddCourse={true} canEditCourse={true} canDeleteCourse={true} />,
    'students': <StudentManagement canAddUser={true} canDeleteUser={true} />,
    'classTypes': <ClassTypeManagement />,
    'teachers': <TeacherContent />,
    'admins': <AdminManagement canAddAdmin={true} canDeleteAdmin={true} canEditAdminLevel={true} />,
    'leads': <LeadManagement canAddLead={true} canEditLead={true} canDeleteLead={true} />,
    'levels': <LevelManagement canAddLevel={true} canEditLevel={true} canDeleteLevel={true} />,
    'reports': <div className="my-8"><UserActivityReport /></div>,
    'fees': <ContentWrapper title="Fees Management" description="Manage fees and payment options"><Card className="p-6">Fees management functionality coming soon</Card></ContentWrapper>,
    'communication': <ContentWrapper title="Communication" description="Manage communication with students and teachers"><Card className="p-6">Communication functionality coming soon</Card></ContentWrapper>,
    'intramural': <ContentWrapper title="Intramural Activities" description="Manage intramural activities and events"><Card className="p-6">Intramural activities functionality coming soon</Card></ContentWrapper>,
    'access': <ContentWrapper title="Access Management" description="Manage access control and permissions"><Card className="p-6">Access control functionality coming soon</Card></ContentWrapper>,
  };
  
  return contentMap[tab] || null;
};
