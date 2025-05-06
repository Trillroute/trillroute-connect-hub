
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserGrowthChart from './UserGrowthChart';
import AdminStats from './AdminStats';

interface DashboardOverviewProps {
  stats: any;
  userActivityData: any;
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
      <AdminStats stats={stats} />
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <UserGrowthChart 
            data={userActivityData} 
            currentYear={currentYear} 
            handleYearChange={handleYearChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
