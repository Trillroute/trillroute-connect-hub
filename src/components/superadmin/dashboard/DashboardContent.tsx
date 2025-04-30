
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import ClassTypeManagement from "@/components/admin/class-types/ClassTypeManagement";
import UserActivityReport from "@/components/admin/reports/UserActivityReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LeadKanbanBoard from "@/components/admin/leads/LeadKanbanBoard";
import { Lead } from "@/types/lead";
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminStats from './AdminStats';
import UserGrowthChart from './UserGrowthChart';
import { DashboardStats, UserActivityData } from '../hooks/useDashboardData';

interface DashboardContentProps {
  activeTab: ActiveTab;
  stats: DashboardStats;
  userActivityData: UserActivityData[];
  currentYear: number;
  handleYearChange: (change: number) => void;
  leads: Lead[];
  leadsLoading: boolean;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  stats,
  userActivityData,
  currentYear,
  handleYearChange,
  leads,
  leadsLoading,
  onEditLead,
  onDeleteLead
}) => {
  // Create a common wrapper for content with title and description
  const ContentWrapper = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );

  if (activeTab === 'today') {
    return (
      <>
        <AdminStats {...stats} />
        <div className="grid grid-cols-1 gap-6 mt-8">
          <UserGrowthChart 
            data={userActivityData}
            currentYear={currentYear}
            onYearChange={handleYearChange}
          />
        </div>
      </>
    );
  }

  if (activeTab === 'classTypes') {
    return <ClassTypeManagement />;
  }

  if (activeTab === 'teachers') {
    return (
      <>
        <div className="mb-4">
          <Link 
            to="/admin/teacher-registration" 
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-music-500 text-white hover:bg-music-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-music-500 focus-visible:ring-offset-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Teacher
          </Link>
        </div>
        <TeacherManagement canAddUser={true} canDeleteUser={true} />
      </>
    );
  }

  if (activeTab === 'leads-cards') {
    return (
      <div className="max-w-[1400px] mx-auto w-full">
        <Card className="shadow-none border-0">
          <CardHeader>
            <CardTitle>Leads Kanban Board</CardTitle>
            <CardDescription>
              Drag and drop leads between statuses to update their progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadKanbanBoard
              leads={leads}
              loading={leadsLoading}
              onEdit={onEditLead}
              onDelete={onDeleteLead}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle the rest of the tabs using a mapping approach
  const contentMap: Record<string, React.ReactNode> = {
    'courses': <CourseManagement canAddCourse={true} canEditCourse={true} canDeleteCourse={true} />,
    'courseManagement': <CourseManagement canAddCourse={true} canEditCourse={true} canDeleteCourse={true} />,
    'students': <StudentManagement canAddUser={true} canDeleteUser={true} />,
    'admins': <AdminManagement canAddAdmin={true} canDeleteAdmin={true} canEditAdminLevel={true} />,
    'leads': <LeadManagement canAddLead={true} canEditLead={true} canDeleteLead={true} />,
    'levels': <LevelManagement canAddLevel={true} canEditLevel={true} canDeleteLevel={true} />,
    'reports': <div className="my-8"><UserActivityReport /></div>,
    'scheduling': <ContentWrapper title="Scheduling" description="Manage class schedules and appointments"><Card className="p-6">Scheduling functionality coming soon</Card></ContentWrapper>,
    'fees': <ContentWrapper title="Fees Management" description="Manage fees and payment options"><Card className="p-6">Fees management functionality coming soon</Card></ContentWrapper>,
    'communication': <ContentWrapper title="Communication" description="Manage communication with students and teachers"><Card className="p-6">Communication functionality coming soon</Card></ContentWrapper>,
    'intramural': <ContentWrapper title="Intramural Activities" description="Manage intramural activities and events"><Card className="p-6">Intramural activities functionality coming soon</Card></ContentWrapper>,
    'access': <ContentWrapper title="Access Management" description="Manage access control and permissions"><Card className="p-6">Access control functionality coming soon</Card></ContentWrapper>,
  };

  // Return the mapped content or a placeholder if tab is not found
  return contentMap[activeTab] || (
    <ContentWrapper 
      title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module`} 
      description={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management functionality`}
    >
      <Card className="p-6">
        <p>This module is under development.</p>
      </Card>
    </ContentWrapper>
  );
};

export default DashboardContent;
