
import { useState, useEffect, useCallback, useRef } from 'react';
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

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

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
  
  // Refs to track last fetch time and prevent redundant fetches
  const lastFetchTime = useRef<number>(0);
  const isFetching = useRef<boolean>(false);

  // Batch fetch all dashboard statistics in a single function
  const fetchDashboardData = useCallback(async (force = false) => {
    // Skip if already fetching or if cache is still valid (unless forced)
    const now = Date.now();
    if (
      isFetching.current || 
      (!force && now - lastFetchTime.current < CACHE_DURATION)
    ) {
      return;
    }
    
    try {
      setLoading(true);
      isFetching.current = true;
      
      console.log('Fetching dashboard data...');
      
      // Batch fetch counts for all user types in parallel
      const [coursesResult, studentsResult, teachersResult, adminsResult] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('custom_users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('custom_users').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('custom_users').select('*', { count: 'exact', head: true }).eq('role', 'admin')
      ]);
      
      // Process any errors
      if (coursesResult.error) console.error('Error fetching courses count:', coursesResult.error);
      if (studentsResult.error) console.error('Error fetching students count:', studentsResult.error);
      if (teachersResult.error) console.error('Error fetching teachers count:', teachersResult.error);
      if (adminsResult.error) console.error('Error fetching admins count:', adminsResult.error);
      
      // Update stats with new counts
      setStats({
        coursesCount: coursesResult.count || 0,
        studentsCount: studentsResult.count || 0,
        teachersCount: teachersResult.count || 0,
        adminsCount: adminsResult.count || 0
      });
      
      // Fetch monthly growth data for the current year
      await fetchUserGrowthData(currentYear);
      
      // Update last fetch timestamp
      lastFetchTime.current = Date.now();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [currentYear]);

  const fetchUserGrowthData = async (year: number) => {
    try {
      console.log(`Fetching user growth data for year ${year}...`);
      const monthsData: UserActivityData[] = [];
      
      // Process all months at once using more efficient queries
      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(year, month, 1);
        const monthLabel = format(monthDate, 'MMM');
        
        const startOfMonth = new Date(year, month, 1).toISOString();
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
        
        // Batch query all role counts for this month in parallel
        const [studentsResult, teachersResult, adminsResult] = await Promise.all([
          supabase
            .from('custom_users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .gte('created_at', startOfMonth)
            .lt('created_at', endOfMonth),
          supabase
            .from('custom_users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'teacher')
            .gte('created_at', startOfMonth)
            .lt('created_at', endOfMonth),
          supabase
            .from('custom_users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin')
            .gte('created_at', startOfMonth)
            .lt('created_at', endOfMonth)
        ]);
        
        monthsData.push({
          name: monthLabel,
          Students: studentsResult.count || 0,
          Teachers: teachersResult.count || 0,
          Admins: adminsResult.count || 0
        });
      }
      
      setUserActivityData(monthsData);
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  };

  const handleYearChange = useCallback((change: number) => {
    const newYear = currentYear + change;
    console.log(`Changing year to ${newYear}`);
    setCurrentYear(newYear);
    // This will trigger a re-fetch via the useEffect below
  }, [currentYear]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    
    // Use a combined subscription for efficiency
    const subscription = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'courses' }, 
          () => {
            console.log('Dashboard detected change in courses table');
            // Don't immediately fetch - check if we should refresh based on time
            const now = Date.now();
            if (now - lastFetchTime.current > CACHE_DURATION / 2) {
              fetchDashboardData();
            }
          })
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'custom_users' }, 
          () => {
            console.log('Dashboard detected change in users table');
            // Don't immediately fetch - check if we should refresh based on time
            const now = Date.now();
            if (now - lastFetchTime.current > CACHE_DURATION / 2) {
              fetchDashboardData();
            }
          })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Refetch when year changes
  useEffect(() => {
    fetchUserGrowthData(currentYear);
  }, [currentYear]);

  return {
    stats,
    userActivityData,
    currentYear,
    loading,
    handleYearChange,
    refreshData: () => fetchDashboardData(true) // Force refresh function
  };
};
