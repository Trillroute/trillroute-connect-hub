
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export function useStaffMembers() {
  const { role, user, isSuperAdmin } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchStaffMembers = useCallback(async () => {
    if (!user) return;
    
    console.log('Fetching staff members...');
    setLoading(true);
    
    try {
      // If superadmin, fetch both teachers and admins
      // If admin, fetch only teachers
      const roleFilter = isSuperAdmin() 
        ? ['teacher', 'admin'] 
        : ['teacher'];
      
      console.log('Role filter:', roleFilter);
      
      const { data, error } = await supabase
        .from('custom_users')
        .select('id, first_name, last_name, role')
        .in('role', roleFilter);

      if (error) {
        console.error('Error fetching staff members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff members.',
          variant: 'destructive',
        });
        setStaffMembers([]);
        return;
      }

      console.log('Staff data fetched:', data);

      // Transform to our staff member format
      const staffList: StaffMember[] = data.map(staff => ({
        id: staff.id,
        name: `${staff.first_name} ${staff.last_name}`,
        role: staff.role
      }));

      // Add current user at the top if they're an admin or superadmin
      if (user && (role === 'admin' || role === 'superadmin')) {
        // Check if the current user is already in the list
        const currentUserInList = staffList.find(staff => staff.id === user.id);
        if (!currentUserInList) {
          staffList.unshift({
            id: user.id,
            name: `${user.firstName} ${user.lastName} (You)`,
            role: role
          });
        }
      }

      console.log('Processed staff list:', staffList);
      setStaffMembers(staffList);
    } catch (err) {
      console.error('Failed to fetch staff members:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while fetching staff members.',
        variant: 'destructive',
      });
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  }, [role, user, isSuperAdmin, toast]);

  useEffect(() => {
    if ((role === 'admin' || role === 'superadmin') && user) {
      fetchStaffMembers();
    } else {
      setLoading(false);
    }
  }, [role, user, fetchStaffMembers]);

  return { staffMembers, loading, fetchStaffMembers };
}
