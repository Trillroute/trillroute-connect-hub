
import React from 'react';
import { DashboardStats, UserActivityData } from '../hooks/useDashboardData';
import TodayContent from './content/TodayContent';

interface DashboardOverviewProps {
  stats: DashboardStats;
  userActivityData: UserActivityData[];
  currentYear: number;
  handleYearChange: (year: number) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  userActivityData,
  currentYear,
  handleYearChange,
}) => {
  return (
    <TodayContent
      stats={stats}
      userActivityData={userActivityData}
      currentYear={currentYear}
      handleYearChange={handleYearChange}
    />
  );
};

export default DashboardOverview;
