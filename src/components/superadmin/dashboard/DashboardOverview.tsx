
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserGrowthChart from './UserGrowthChart';
import AdminStats from './AdminStats';
import { DashboardStats, UserActivityData } from '@/components/superadmin/hooks/useDashboardData';

interface DashboardOverviewProps {
  stats: {
    studentsCount: number;
    teachersCount: number;
    adminsCount: number;
    coursesCount: number;
  };
  userActivityData: UserActivityData[];
  currentYear: number;
  handleYearChange: (year: number) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  userActivityData,
  currentYear,
  handleYearChange
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AdminStats 
        studentsCount={stats.studentsCount}
        teachersCount={stats.teachersCount}
        adminsCount={stats.adminsCount}
        coursesCount={stats.coursesCount}
      />
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <UserGrowthChart 
            data={userActivityData} 
            currentYear={currentYear} 
            onYearChange={handleYearChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
