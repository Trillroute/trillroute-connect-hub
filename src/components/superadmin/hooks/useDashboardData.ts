
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface DashboardStats {
  coursesCount: number;
  studentsCount: number;
  teachersCount: number;
  adminsCount: number;
}

export interface UserActivityData {
  name: string;
  Students: number;
  Teachers: number;
  Admins: number;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    coursesCount: 0,
    studentsCount: 0,
    teachersCount: 0,
    adminsCount: 0
  });
  const [userActivityData, setUserActivityData] = useState<UserActivityData[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const { count: totalCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
        
      if (coursesError) {
        console.error('Error fetching courses count:', coursesError);
      }
      
      const { count: totalStudents, error: studentsError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
        
      if (studentsError) {
        console.error('Error fetching students count:', studentsError);
      }
      
      const { count: totalTeachers, error: teachersError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');
        
      if (teachersError) {
        console.error('Error fetching teachers count:', teachersError);
      }

      const { count: totalAdmins, error: adminsError } = await supabase
        .from('custom_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');
        
      if (adminsError) {
        console.error('Error fetching admins count:', adminsError);
      }
      
      setStats({
        coursesCount: totalCourses || 0,
        studentsCount: totalStudents || 0,
        teachersCount: totalTeachers || 0,
        adminsCount: totalAdmins || 0
      });
      
      await fetchUserGrowthData(currentYear);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGrowthData = async (year: number) => {
    try {
      const monthsData: UserActivityData[] = [];
      
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

  return {
    stats,
    userActivityData,
    currentYear,
    loading,
    handleYearChange,
    fetchDashboardData
  };
};
