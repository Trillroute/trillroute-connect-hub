
import { useState, useEffect } from 'react';
import { fetchAllStaffAvailability } from '@/services/availability/staffAvailabilityApi';
import { UserAvailabilityMap } from '@/services/availability/types';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface UseStaffAvailabilityResult {
  staffMembers: StaffMember[];
  availabilityByUser: UserAvailabilityMap;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStaffAvailability = (): UseStaffAvailabilityResult => {
  const [availabilityByUser, setAvailabilityByUser] = useState<UserAvailabilityMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  const fetchStaffAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching staff availability data...");
      const data = await fetchAllStaffAvailability();
      console.log("Received staff availability data:", data);
      setAvailabilityByUser(data);
      
      // Extract staff members from the data
      const members: StaffMember[] = Object.entries(data).map(([id, userData]) => ({
        id,
        name: userData.name || 'Unknown User',
        role: userData.role || 'staff'
      }));
      
      console.log("Extracted staff members:", members);
      setStaffMembers(members);
    } catch (err) {
      console.error("Error in useStaffAvailability hook:", err);
      setError(err instanceof Error ? err : new Error('Failed to load staff availability'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAvailability();
  }, []);

  return {
    staffMembers,
    availabilityByUser,
    loading,
    error,
    refetch: fetchStaffAvailability
  };
};
