
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import { DashboardStats, UserActivityData } from '../hooks/useDashboardData';
import { Lead } from "@/types/lead";

// Import our new component files
import TodayContent from './content/TodayContent';
import LeadsKanbanContent from './content/LeadsKanbanContent';
import SchedulingContent from './content/SchedulingContent';
import PlaceholderContent from './content/PlaceholderContent';
import { getTabContent } from './content/TabContentMap';

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
  // Handle specific tabs with dedicated components
  if (activeTab === 'today') {
    return (
      <TodayContent 
        stats={stats}
        userActivityData={userActivityData}
        currentYear={currentYear}
        handleYearChange={handleYearChange}
      />
    );
  }

  if (activeTab === 'leads-cards') {
    return (
      <LeadsKanbanContent
        leads={leads}
        loading={leadsLoading}
        onEdit={onEditLead}
        onDelete={onDeleteLead}
      />
    );
  }

  if (activeTab === 'scheduling') {
    return <SchedulingContent />;
  }

  // Handle the rest of the tabs using a mapping approach
  const content = getTabContent(activeTab);
  
  // If we have a component for this tab, return it
  if (content) {
    return <>{content}</>;
  }

  // If no specific component found, return a placeholder
  return <PlaceholderContent tab={activeTab} />;
};

export default DashboardContent;
