
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import UserAvailabilitySchedule from '@/components/admin/scheduling/user-availability/UserAvailabilitySchedule';
import { useUserAvailability } from '@/hooks/useUserAvailability';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

const UserAvailabilityContent: React.FC = () => {
  const { role, user, isSuperAdmin } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(true);
  
  const { 
    loading,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  } = useUserAvailability(selectedUserId || undefined);

  // Set the initial selected user to the current user
  useEffect(() => {
    if (user && !selectedUserId) {
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);

  // Fetch staff members (teachers, admins) that can be managed
  useEffect(() => {
    const fetchStaffMembers = async () => {
      if (!user) return;

      setIsLoadingStaff(true);
      try {
        // If superadmin, fetch both teachers and admins
        // If admin, fetch only teachers
        const roleFilter = isSuperAdmin() 
          ? ['teacher', 'admin'] 
          : ['teacher'];
        
        const { data, error } = await supabase
          .from('custom_users')
          .select('id, first_name, last_name, role')
          .in('role', roleFilter);

        if (error) {
          console.error('Error fetching staff members:', error);
          return;
        }

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

        setStaffMembers(staffList);
        setIsLoadingStaff(false);
      } catch (err) {
        console.error('Failed to fetch staff members:', err);
        setIsLoadingStaff(false);
      }
    };

    if ((role === 'admin' || role === 'superadmin') && user) {
      fetchStaffMembers();
    }
  }, [role, user, isSuperAdmin]);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
  };

  // Find selected user details
  const selectedUser = staffMembers.find(member => member.id === selectedUserId);
  const isOwnAvailability = selectedUserId === user?.id;
  
  const renderUserSelector = () => {
    if (isLoadingStaff) {
      return (
        <div className="flex items-center justify-center p-2 border rounded-md bg-white">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading users...
        </div>
      );
    }

    if (staffMembers.length === 0) {
      return (
        <div className="flex items-center justify-center p-2 border rounded-md bg-white">
          No staff members found
        </div>
      );
    }

    return (
      <Select
        defaultValue={selectedUserId || undefined}
        onValueChange={handleUserChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {/* Self section */}
          {user && (
            <SelectGroup>
              <SelectLabel>Your Availability</SelectLabel>
              <SelectItem value={user.id}>
                {user.firstName} {user.lastName} (You)
              </SelectItem>
            </SelectGroup>
          )}

          {/* Teachers section */}
          {staffMembers.filter(staff => staff.role === 'teacher' && staff.id !== user?.id).length > 0 && (
            <SelectGroup>
              <SelectLabel>Teachers</SelectLabel>
              {staffMembers
                .filter(staff => staff.role === 'teacher' && staff.id !== user?.id)
                .map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}

          {/* Admins section - only for superadmins */}
          {isSuperAdmin() && staffMembers.filter(staff => staff.role === 'admin' && staff.id !== user?.id).length > 0 && (
            <SelectGroup>
              <SelectLabel>Admins</SelectLabel>
              {staffMembers
                .filter(staff => staff.role === 'admin' && staff.id !== user?.id)
                .map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    );
  };
  
  return (
    <ContentWrapper
      title="User Availability"
      description="Define when users are available throughout the week"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <Badge variant="outline" className="bg-gray-100">
          Viewing as: {role?.toUpperCase()}
        </Badge>

        {/* Show user selector for admins and superadmins */}
        {(role === 'admin' || role === 'superadmin') && (
          <div className="w-full md:w-64">
            {renderUserSelector()}
          </div>
        )}
      </div>

      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-280px)] overflow-auto">
        {selectedUserId ? (
          <>
            {!isOwnAvailability && selectedUser && (
              <div className="p-4 bg-blue-50 border-b border-blue-100 text-blue-700 font-medium">
                You are managing availability for: {selectedUser.name} ({selectedUser.role})
              </div>
            )}
            <UserAvailabilitySchedule 
              dailyAvailability={dailyAvailability}
              loading={loading}
              onAddSlot={addSlot}
              onUpdateSlot={updateSlot}
              onDeleteSlot={deleteSlot}
              onCopyDay={copyDaySlots}
              onRefresh={refreshAvailability}
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Please select a user to manage their availability</p>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default UserAvailabilityContent;
