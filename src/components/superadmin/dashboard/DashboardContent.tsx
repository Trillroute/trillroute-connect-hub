
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import { DashboardStats, UserActivityData } from '../hooks/useDashboardData';
import { Lead } from "@/types/lead";

// Import our components
import TodayContent from './content/TodayContent';
import LeadsKanbanContent from './content/LeadsKanbanContent';
import SchedulingContent from './content/SchedulingContent';
import TabContentMap from './content/TabContentMap';

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

  // For all other tabs, use the TabContentMap component
  return (
    <TabContentMap 
      activeTab={activeTab} 
      stats={stats}
      userActivityData={userActivityData}
      currentYear={currentYear}
      handleYearChange={handleYearChange}
      leads={leads}
      leadsLoading={leadsLoading}
      onEditLead={onEditLead}
      onDeleteLead={onDeleteLead}
    />
  );
};

export default DashboardContent;
