import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, LineChart } from '@/components/ui/charts';
import { Download, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [coursesCount, setCoursesCount] = useState(0);
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userActivityData, setUserActivityData] = useState<{ name: string; Students: number; Teachers: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; Revenue: number }[]>([]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get all courses count
        const { count: totalCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });
          
        if (coursesError) {
          console.error('Error fetching courses count:', coursesError);
        } else {
          setCoursesCount(totalCourses || 0);
        }
        
        // Get active courses count
        const { count: activeCourses, error: activeCoursesError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Active');
          
        if (activeCoursesError) {
          console.error('Error fetching active courses count:', activeCoursesError);
        } else {
          setActiveCoursesCount(activeCourses || 0);
        }
        
        // Get students count - This is just a placeholder as we're not storing students in this implementation
        // In a real implementation, you would fetch from the users table with role filter
        setStudentsCount(0);
        
        // Get teachers count - This is just a placeholder as we're not storing teachers in this implementation
        // In a real implementation, you would fetch from the users table with role filter
        setTeachersCount(0);
        
        // Create empty chart data for user activity and revenue (no actual data available)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        setUserActivityData(months.map(month => ({ name: month, Students: 0, Teachers: 0 })));
        setRevenueData(months.map(month => ({ name: month, Revenue: 0 })));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('public:courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Here's an overview of Trillroute Music School.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
            <Download className="h-4 w-4 mr-2" />
            Download Reports
          </Button>
          <Button className="bg-music-500 hover:bg-music-600">
            <Settings className="h-4 w-4 mr-2" />
            School Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
            <CardDescription>Enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{studentsCount}</div>
            <p className="text-sm text-gray-500 mt-1">
              {studentsCount === 0 ? "No students enrolled yet" : `${studentsCount} enrolled students`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Teachers</CardTitle>
            <CardDescription>Active instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{teachersCount}</div>
            <p className="text-sm text-gray-500 mt-1">
              {teachersCount === 0 ? "No teachers registered yet" : `${teachersCount} active teachers`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Courses</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{activeCoursesCount}</div>
            <p className="text-sm text-gray-500 mt-1">
              {activeCoursesCount === 0 ? "No active courses" : `${activeCoursesCount} active courses`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Courses</CardTitle>
            <CardDescription>All courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{coursesCount}</div>
            <p className="text-sm text-gray-500 mt-1">
              {coursesCount === 0 ? "No courses created yet" : `${coursesCount} total courses`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Management Section */}
      <div className="mb-8">
        <CourseManagement />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Students and teachers over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {userActivityData.length > 0 ? (
              <AreaChart
                data={userActivityData}
                index="name"
                categories={["Students", "Teachers"]}
                colors={["music.500", "music.300"]}
                valueFormatter={(value: number) => `${value}`}
                className="h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No user activity data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Financial performance</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {revenueData.length > 0 ? (
              <LineChart
                data={revenueData}
                index="name"
                categories={["Revenue"]}
                colors={["music.500"]}
                valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                className="h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
