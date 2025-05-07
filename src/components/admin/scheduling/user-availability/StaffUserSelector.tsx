
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { type StaffMember } from "@/hooks/useStaffAvailability";

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
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (staffMembers.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No staff members available
      </div>
    );
  }

  return (
    <Select
      value={selectedUserId || undefined}
      onValueChange={onUserChange}
    >
      <SelectTrigger className="w-full" aria-label="Select staff member">
        <SelectValue placeholder="Select staff member" />
      </SelectTrigger>
      <SelectContent>
        {staffMembers.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name} {member.role ? `(${member.role})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StaffUserSelector;
