
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import { Card, CardContent } from '@/components/ui/card';
import AdminManagement from '@/components/superadmin/AdminManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import DashboardOverview from './DashboardOverview';

interface DashboardContentProps {
  activeTab: ActiveTab;
  stats: any;
  userActivityData: any;
  currentYear: number;
  handleYearChange: (year: number) => void;
  leads: any[];
  leadsLoading: boolean;
  onEditLead: (lead: any) => void;
  onDeleteLead: (lead: any) => void;
}

const DashboardContent = ({
  activeTab,
  stats,
  userActivityData,
  currentYear,
  handleYearChange,
  leads,
  leadsLoading,
  onEditLead,
  onDeleteLead
}: DashboardContentProps) => {
  switch (activeTab) {
    case 'today':
      return (
        <DashboardOverview
          stats={stats}
          userActivityData={userActivityData}
          currentYear={currentYear}
          handleYearChange={handleYearChange}
        />
      );
    case 'students':
      return <StudentManagement />;
    case 'teachers':
      return <TeacherManagement />;
    case 'admins':
      return <AdminManagement />;
    case 'levels':
      return <LevelManagement />;
    case 'courses':
    case 'classTypes':
      return <CourseManagement selectedTab={activeTab} />;
    case 'leads':
    case 'leads-cards':
      return (
        <LeadManagement
          initialView={activeTab === 'leads-cards' ? 'kanban' : 'table'}
          leads={leads}
          isLoading={leadsLoading}
          onEditLead={onEditLead}
          onDeleteLead={onDeleteLead}
        />
      );
    default:
      return (
        <Card>
          <CardContent className="p-8">
            <h3 className="text-lg font-medium">Coming Soon</h3>
            <p className="text-gray-500">This section is under development.</p>
          </CardContent>
        </Card>
      );
  }
};

export default DashboardContent;
