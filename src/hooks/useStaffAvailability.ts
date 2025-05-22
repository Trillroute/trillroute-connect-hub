
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the StaffMember type that was missing
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  name: string; // Add name property needed by the components
}

export interface UseStaffAvailabilityResult {
  staffMembers: StaffMember[];
  loading: boolean;
  error: any;
  fetchStaffMembers: () => Promise<void>;
  refetch: () => Promise<void>; // Add refetch alias
}

export const useStaffAvailability = (): UseStaffAvailabilityResult => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      // Fix the query to use custom_users instead of users table
      const { data, error } = await supabase
        .from('custom_users')
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
        role: 'staff',
        // Add name property by combining first and last name
        name: `${staff.first_name || staff.firstName || ''} ${staff.last_name || staff.lastName || ''}`.trim()
      }));

      setStaffMembers(transformedStaffMembers);
    } catch (err) {
      setError(err);
      console.error('Error fetching staff members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create an alias for fetchStaffMembers to satisfy the interface
  const refetch = fetchStaffMembers;

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  return { staffMembers, loading, error, fetchStaffMembers, refetch };
};
