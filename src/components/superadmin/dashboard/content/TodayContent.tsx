
import React from 'react';
import AdminStats from '../AdminStats';
import UserGrowthChart from '../UserGrowthChart';
import { DashboardStats, UserActivityData } from '../../hooks/useDashboardData';

interface TodayContentProps {
  stats: DashboardStats;
  userActivityData: UserActivityData[];
  currentYear: number;
  handleYearChange: (change: number) => void;
}

const TodayContent: React.FC<TodayContentProps> = ({
  stats,
  userActivityData,
  currentYear,
  handleYearChange,
}) => {
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
};

export default TodayContent;
