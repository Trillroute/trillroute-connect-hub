
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin' | 'superadmin';
  name: string; // Combined full name for display
}

export function useStaffAvailability() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      console.log('Fetching staff availability members...');
      
      const { data, error } = await supabase
        .from("custom_users")
        .select("id, first_name, last_name, role")
        .in("role", ["teacher", "admin", "superadmin"]);
      
      if (error) {
        console.error('Error fetching staff members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff members.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Staff data fetched:', data);
      
      if (data) {
        const mappedStaff: StaffMember[] = data.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role as 'teacher' | 'admin' | 'superadmin',
          name: `${user.first_name} ${user.last_name}`
        }));

        console.log('Mapped staff members:', mappedStaff);
        setStaffMembers(mappedStaff);
      }
    } catch (err) {
      console.error('Failed to fetch staff members:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while fetching staff members.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
    
    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('custom_users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'custom_users' }, 
        () => fetchStaffMembers())
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { staffMembers, loading, fetchStaffMembers };
}
