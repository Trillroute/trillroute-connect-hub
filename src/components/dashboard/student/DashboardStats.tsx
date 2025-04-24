
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
  enrolledCoursesCount: number;
}

export const DashboardStats = ({ enrolledCoursesCount }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Enrolled Courses</CardTitle>
          <CardDescription>Your active courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-music-500">{enrolledCoursesCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed Lessons</CardTitle>
          <CardDescription>Your learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-music-500">0</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Practice Hours</CardTitle>
          <CardDescription>This month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-music-500">0</div>
        </CardContent>
      </Card>
    </div>
  );
};
