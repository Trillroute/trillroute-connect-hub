
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AreaChart } from '@/components/ui/charts';

interface UserGrowthData {
  name: string;
  Students: number;
  Teachers: number;
  Admins: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
  currentYear: number;
  onYearChange: (change: number) => void;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  data,
  currentYear,
  onYearChange,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <CardTitle>User Growth {currentYear}</CardTitle>
          <CardDescription>All users registered by month</CardDescription>
        </div>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onYearChange(-1)}
          >
            Previous Year
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onYearChange(1)}
          >
            Next Year
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <AreaChart
            data={data}
            index="name"
            categories={["Students", "Teachers", "Admins"]}
            colors={["music.500", "music.300", "music.700"]}
            valueFormatter={(value: number) => `${value}`}
            className="h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading user growth data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
