
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart } from '@/components/ui/charts';
import { Download, Settings, Users, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import UserManagement from '@/components/admin/UserManagement';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userActivityData, setUserActivityData] = useState<{ name: string; Students: number; Teachers: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; Revenue: number }[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');
  
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
      
      // Fetch monthly user growth data (all months in the current year)
      await fetchUserGrowthData(currentYear);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserGrowthData = async (year: number) => {
    try {
      const monthsData: { name: string; Students: number; Teachers: number }[] = [];
      
      // Generate all 12 months of the year
      for (let month = 0; month < 12; month++) {
        // Create date for first day of the month in the selected year
        const monthDate = new Date(year, month, 1);
        // Get month name (short format)
        const monthLabel = format(monthDate, 'MMM');
        
        // Calculate start and end of the month for database queries
        const startOfMonth = new Date(year, month, 1).toISOString();
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
        
        // Count students registered in this month
        const { count: monthlyStudents, error: studentsError } = await supabase
          .from('custom_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student')
          .gte('created_at', startOfMonth)
          .lt('created_at', endOfMonth);
          
        if (studentsError) {
          console.error(`Error fetching students for ${monthLabel}:`, studentsError);
        }
        
        // Count teachers registered in this month
        const { count: monthlyTeachers, error: teachersError } = await supabase
          .from('custom_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher')
          .gte('created_at', startOfMonth)
          .lt('created_at', endOfMonth);
          
        if (teachersError) {
          console.error(`Error fetching teachers for ${monthLabel}:`, teachersError);
        }
        
        monthsData.push({
          name: monthLabel,
          Students: monthlyStudents || 0,
          Teachers: monthlyTeachers || 0
        });
      }
      
      setUserActivityData(monthsData);
      
      // Mock revenue data based on the same months
      setRevenueData(monthsData.map(({ name }) => ({ 
        name, 
        Revenue: Math.floor(Math.random() * 10000) + 1000 
      })));
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  };

  const handleYearChange = (change: number) => {
    const newYear = currentYear + change;
    setCurrentYear(newYear);
    fetchUserGrowthData(newYear);
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
      
    const userSubscription = supabase
      .channel('custom_users_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_users' }, () => {
        console.log('Dashboard detected change in users');
        fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
      userSubscription.unsubscribe();
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
            <div className="flex items-center">
              <Users className="h-8 w-8 text-music-500 mr-3" />
              <div>
                <div className="text-3xl font-bold text-music-500">{studentsCount}</div>
                <p className="text-sm text-gray-500 mt-1">
                  {studentsCount === 0 ? "No students enrolled yet" : `${studentsCount} enrolled students`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Teachers</CardTitle>
            <CardDescription>Active instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-music-500 mr-3" />
              <div>
                <div className="text-3xl font-bold text-music-500">{teachersCount}</div>
                <p className="text-sm text-gray-500 mt-1">
                  {teachersCount === 0 ? "No teachers registered yet" : `${teachersCount} active teachers`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Courses</CardTitle>
            <CardDescription>All courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-music-500 mr-3" />
              <div>
                <div className="text-3xl font-bold text-music-500">{coursesCount}</div>
                <p className="text-sm text-gray-500 mt-1">
                  {coursesCount === 0 ? "No courses created yet" : `${coursesCount} total courses`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border bg-card p-1 text-card-foreground shadow">
          <Button
            variant={activeTab === 'courses' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('courses')}
            className="rounded-md px-3 py-1"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="rounded-md px-3 py-1"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
        </div>
      </div>

      <div className="mb-8">
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'users' && <UserManagement />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>User Growth {currentYear}</CardTitle>
              <CardDescription>Students and teachers registered by month</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleYearChange(-1)}
              >
                Previous Year
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleYearChange(1)}
              >
                Next Year
              </Button>
            </div>
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
                <p>Loading user growth data...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
