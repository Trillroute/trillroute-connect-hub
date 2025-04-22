import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart } from '@/components/ui/charts';
import { Download, Settings, School, BookOpen, GraduationCap, UserPlus, Shield, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import CreateClassTypeForm from "@/components/admin/class-types/CreateClassTypeForm";
import ClassTypeManagement from "@/components/admin/class-types/ClassTypeManagement";
import AdminSidebar from '@/components/admin/AdminSidebar';

type ActiveTab = 'courses' | 'classTypes' | 'students' | 'teachers' | 'admins' | 'leads' | 'levels';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userActivityData, setUserActivityData] = useState<{ name: string; Students: number; Teachers: number; Admins: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ name: string; Revenue: number }[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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

      const { count: totalAdmins, error: adminsError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');
        
      if (adminsError) {
        console.error('Error fetching admins count:', adminsError);
      } else {
        setAdminsCount(totalAdmins || 0);
      }
      
      await fetchUserGrowthData(currentYear);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserGrowthData = async (year: number) => {
    try {
      const monthsData: { name: string; Students: number; Teachers: number; Admins: number }[] = [];
      
      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(year, month, 1);
        const monthLabel = format(monthDate, 'MMM');
        
        const startOfMonth = new Date(year, month, 1).toISOString();
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
        
        const { count: monthlyStudents, error: studentsError } = await supabase
          .from('custom_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student')
          .gte('created_at', startOfMonth)
          .lt('created_at', endOfMonth);
          
        if (studentsError) {
          console.error(`Error fetching students for ${monthLabel}:`, studentsError);
        }
        
        const { count: monthlyTeachers, error: teachersError } = await supabase
          .from('custom_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher')
          .gte('created_at', startOfMonth)
          .lt('created_at', endOfMonth);
          
        if (teachersError) {
          console.error(`Error fetching teachers for ${monthLabel}:`, teachersError);
        }

        const { count: monthlyAdmins, error: adminsError } = await supabase
          .from('custom_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')
          .gte('created_at', startOfMonth)
          .lt('created_at', endOfMonth);
          
        if (adminsError) {
          console.error(`Error fetching admins for ${monthLabel}:`, adminsError);
        }
        
        monthsData.push({
          name: monthLabel,
          Students: monthlyStudents || 0,
          Teachers: monthlyTeachers || 0,
          Admins: monthlyAdmins || 0
        });
      }
      
      setUserActivityData(monthsData);
      
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
  
  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
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
  
  const permissionMap = {
    courses: { view: true, add: true, edit: true, delete: true },
    students: { view: true, add: true, edit: true, delete: true },
    teachers: { view: true, add: true, edit: true, delete: true },
    admins: { view: true, add: true, edit: true, delete: true },
    leads: { view: true, add: true, edit: true, delete: true },
    levels: { view: true, add: true, edit: true, delete: true }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
        permissionMap={{
          courses: { view: true },
          classTypes: { view: true },
          students: { view: true },
          teachers: { view: true },
          admins: { view: true },
          leads: { view: true },
          levels: { view: true }
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </Button>
              <Button className="bg-music-500 hover:bg-music-600">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </Button>
              <Button className="bg-music-500 hover:bg-music-600">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Students</CardTitle>
                <CardDescription>Enrolled students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <School className="h-8 w-8 text-music-500 mr-3" />
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
                <CardTitle className="text-lg">Total Admins</CardTitle>
                <CardDescription>All administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-music-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold text-music-500">{adminsCount}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {adminsCount === 0 ? "No admins registered yet" : `${adminsCount} active admins`}
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

          {activeTab === 'classTypes' && (
            <div className="mb-6">
              <ClassTypeManagement />
            </div>
          )}

          <div className="space-y-6">
            {activeTab === 'teachers' && (
              <div className="mb-4">
                <Link 
                  to="/admin/teacher-registration" 
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-music-500 text-white hover:bg-music-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-music-500 focus-visible:ring-offset-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Register New Teacher
                </Link>
              </div>
            )}
            
            {activeTab === 'courses' && <CourseManagement canAddCourse={true} canEditCourse={true} canDeleteCourse={true} />}
            {activeTab === 'students' && <StudentManagement canAddUser={true} canDeleteUser={true} />}
            {activeTab === 'teachers' && <TeacherManagement canAddUser={true} canDeleteUser={true} />}
            {activeTab === 'admins' && <AdminManagement canAddAdmin={true} canDeleteAdmin={true} canEditAdminLevel={true} />}
            {activeTab === 'leads' && <LeadManagement canAddLead={true} canEditLead={true} canDeleteLead={true} />}
            {activeTab === 'levels' && <LevelManagement canAddLevel={true} canEditLevel={true} canDeleteLevel={true} />}
          </div>

          <div className="grid grid-cols-1 gap-6 mt-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
