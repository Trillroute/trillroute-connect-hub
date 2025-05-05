
import React from 'react';
import { Loader2 } from 'lucide-react';
import { StaffMember } from '@/hooks/useStaffMembers';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface UserSelectorProps {
  staffMembers: StaffMember[];
  selectedUserId: string | null;
  isLoading: boolean;
  onUserChange: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  staffMembers,
  selectedUserId,
  isLoading,
  onUserChange
}) => {
  const { user, isSuperAdmin } = useAuth();
  
  console.log('UserSelector props:', { 
    staffCount: staffMembers.length, 
    selectedUserId, 
    isLoading 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2 border rounded-md bg-white">
        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <div className="flex items-center justify-center p-2 border rounded-md bg-white">
        No staff members found
      </div>
    );
  }

  // Filter staff members by role for organized display
  const teachers = staffMembers.filter(staff => staff.role === 'teacher' && staff.id !== user?.id);
  const admins = staffMembers.filter(staff => staff.role === 'admin' && staff.id !== user?.id);
  const currentUser = staffMembers.find(staff => staff.id === user?.id);

  console.log('Filtered staff:', { teachers, admins, currentUser });

  return (
    <Select
      defaultValue={selectedUserId || undefined}
      onValueChange={onUserChange}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {/* Self section */}
        {currentUser && (
          <SelectGroup>
            <SelectLabel>Your Availability</SelectLabel>
            <SelectItem value={currentUser.id}>
              {currentUser.name}
            </SelectItem>
          </SelectGroup>
        )}

        {/* Teachers section */}
        {teachers.length > 0 && (
          <SelectGroup>
            <SelectLabel>Teachers</SelectLabel>
            {teachers.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {/* Admins section - only for superadmins */}
        {isSuperAdmin() && admins.length > 0 && (
          <SelectGroup>
            <SelectLabel>Admins</SelectLabel>
            {admins.map(staff => (
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

export default UserSelector;
