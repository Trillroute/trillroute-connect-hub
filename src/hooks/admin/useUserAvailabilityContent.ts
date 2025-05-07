
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserAvailability, DayAvailability } from '@/hooks/useUserAvailability';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/hooks/useStaffAvailability';

interface UseUserAvailabilityContentResult {
  // User and permissions
  role: string | undefined;
  user: any;
  
  // Staff data
  staffMembers: StaffMember[];
  isLoadingStaff: boolean;
  staffError: Error | null;
  handleRefreshStaff: () => Promise<void>;
  
  // Selected user
  selectedUserId: string | null;
  isUserChanging: boolean;
  selectedUser: StaffMember | undefined;
  isOwnAvailability: boolean;
  handleUserChange: (userId: string) => void;
  
  // Availability data
  isLoadingAvailability: boolean;
  dailyAvailability: DayAvailability[];
  showLoading: boolean;
  
  // Availability actions
  handleRefresh: () => Promise<void>;
  addSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  updateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  deleteSlot: (id: string) => Promise<boolean>;
  copyDaySlots: (fromDay: number, toDay: number) => Promise<boolean>;
}

export const useUserAvailabilityContent = (): UseUserAvailabilityContentResult => {
  const { role, user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isUserChanging, setIsUserChanging] = useState(false);
  
  // Staff members fetching
  const { 
    staffMembers, 
    loading: isLoadingStaff, 
    refetch: refetchStaffMembers,
    error: staffError
  } = useStaffAvailability();
  
  // Set the initial selected user to the current user
  useEffect(() => {
    if (user && !selectedUserId && user.id) {
      console.log('Setting initial selectedUserId to current user:', user.id);
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);
  
  // Force refetch staff members data on initial render
  useEffect(() => {
    refetchStaffMembers().catch(error => {
      console.error("Failed to fetch staff members:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members. Please try again.",
        variant: "destructive"
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // User availability data
  const { 
    loading: isLoadingAvailability,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  } = useUserAvailability(selectedUserId || undefined);

  // Handler functions
  const handleUserChange = useCallback((userId: string) => {
    console.log('User changed to:', userId);
    // When user changes, we reset everything
    setIsUserChanging(true);
    setSelectedUserId(userId);
    
    // Reset user changing state after a short delay
    setTimeout(() => {
      setIsUserChanging(false);
    }, 500);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isLoadingAvailability || isUserChanging) {
      console.log('Already refreshing or changing user, skipping request');
      return;
    }
    
    try {
      await refreshAvailability();
      toast({
        title: "Availability refreshed",
        description: "Your availability schedule has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing availability:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh availability schedule.",
        variant: "destructive"
      });
    }
  }, [refreshAvailability, isLoadingAvailability, isUserChanging, toast]);

  const handleRefreshStaff = useCallback(async () => {
    try {
      await refetchStaffMembers();
      toast({
        title: "Staff members refreshed",
        description: "Staff list has been updated."
      });
    } catch (error) {
      console.error("Error refreshing staff members:", error);
      toast({
        title: "Staff refresh failed",
        description: "Could not refresh staff members list.",
        variant: "destructive"
      });
    }
  }, [refetchStaffMembers, toast]);

  // Derived state
  const selectedUser = staffMembers.find(member => member.id === selectedUserId);
  const isOwnAvailability = selectedUserId === user?.id;
  const showLoading = isLoadingStaff || !selectedUserId || isUserChanging;
  
  return {
    // User and permissions
    role,
    user,
    
    // Staff data
    staffMembers,
    isLoadingStaff,
    staffError,
    handleRefreshStaff,
    
    // Selected user
    selectedUserId,
    isUserChanging,
    selectedUser, 
    isOwnAvailability,
    handleUserChange,
    
    // Availability data
    isLoadingAvailability,
    dailyAvailability,
    showLoading,
    
    // Availability actions
    handleRefresh,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots,
  };
};
