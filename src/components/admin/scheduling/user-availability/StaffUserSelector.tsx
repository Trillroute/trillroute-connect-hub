
import React from 'react';
import { Loader2, User, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StaffMember } from '@/hooks/useStaffAvailability';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface StaffUserSelectorProps {
  staffMembers: StaffMember[];
  selectedUserId: string | null;
  isLoading: boolean;
  onUserChange: (userId: string) => void;
}

const StaffUserSelector: React.FC<StaffUserSelectorProps> = ({
  staffMembers,
  selectedUserId,
  isLoading,
  onUserChange
}) => {
  const { user, isSuperAdmin } = useAuth();
  
  console.log('StaffUserSelector props:', { 
    staffCount: staffMembers.length, 
    selectedUserId, 
    isLoading,
    currentUser: user?.id
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

  // Group staff members by role
  const teachers = staffMembers.filter(staff => staff.role === 'teacher' && staff.id !== user?.id);
  const admins = staffMembers.filter(staff => staff.role === 'admin' && staff.id !== user?.id);
  const superadmins = staffMembers.filter(staff => staff.role === 'superadmin' && staff.id !== user?.id);
  const currentUser = staffMembers.find(staff => staff.id === user?.id);

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
            <SelectItem value={currentUser.id} className="flex items-center gap-2">
              <User className="h-4 w-4 mr-1" />
              {currentUser.name} (You)
            </SelectItem>
          </SelectGroup>
        )}

        {/* Teachers section */}
        {teachers.length > 0 && (
          <SelectGroup>
            <SelectLabel>Teachers</SelectLabel>
            {teachers.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {staff.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {/* Admins section - only for superadmins and admins */}
        {(isSuperAdmin() || user?.role === 'admin') && admins.length > 0 && (
          <SelectGroup>
            <SelectLabel>Admins</SelectLabel>
            {admins.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {staff.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {/* SuperAdmins section - only visible to other superadmins */}
        {isSuperAdmin() && superadmins.length > 0 && (
          <SelectGroup>
            <SelectLabel>SuperAdmins</SelectLabel>
            {superadmins.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {staff.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default StaffUserSelector;
