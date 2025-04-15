
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart } from '@/components/ui/charts';
import { Download, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userActivityData, setUserActivityData] = useState<{ name: string; Students: number; Teachers: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; Revenue: number }[]>([]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const { count: totalCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
        
      if (coursesError) {
        console.error('Error fetching courses count:', coursesError);
      } else {
        setCoursesCount(totalCourses || 0);
      }
      
      const { count: totalStudents, error: studentsError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
        
      if (studentsError) {
        console.error('Error fetching students count:', studentsError);
      } else {
        setStudentsCount(totalStudents || 0);
      }
      
      const { count: totalTeachers, error: teachersError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');
        
      if (teachersError) {
        console.error('Error fetching teachers count:', teachersError);
      } else {
        setTeachersCount(totalTeachers || 0);
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      setUserActivityData(months.map(month => ({ name: month, Students: 0, Teachers: 0 })));
      setRevenueData(months.map(month => ({ name: month, Revenue: 0 })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
    
    const subscription = supabase
      .channel('public:courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
        console.log('Dashboard detected change in courses:', payload);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="mb-8">
        <CourseManagement />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
