
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the StaffMember type that was missing
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UseStaffAvailabilityResult {
  staffMembers: StaffMember[];
  loading: boolean;
  error: any;
  fetchStaffMembers: () => Promise<void>;
}

export const useStaffAvailability = (): UseStaffAvailabilityResult => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      // Fetch staff members from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'staff');

      if (error) {
        throw error;
      }

      const transformedStaffMembers: StaffMember[] = data.map((staff: any) => ({
        id: staff.id,
        firstName: staff.first_name || staff.firstName || '',
        lastName: staff.last_name || staff.lastName || '',
        email: staff.email || '',
        role: 'staff'
      }));

      setStaffMembers(transformedStaffMembers);
    } catch (err) {
      setError(err);
      console.error('Error fetching staff members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  return { staffMembers, loading, error, fetchStaffMembers };
};
