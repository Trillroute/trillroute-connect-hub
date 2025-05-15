
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectedUser } from '../../context/calendarTypes';

interface SelectedUsersListProps {
  selectedUsers: SelectedUser[];
  toggleUser: (user: SelectedUser) => void;
  getLevelColor: (layer: string) => string;
}

const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  selectedUsers,
  toggleUser,
  getLevelColor
}) => {
  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-[100px]">
      {selectedUsers.map((user) => (
        <DropdownMenuItem
          key={user.id}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => toggleUser(user)}
        >
          <div className={`w-2 h-2 rounded-full ${getLevelColor(user.layer || '')}`} />
          <span className="text-sm">{user.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              toggleUser(user);
            }}
          >
            <span className="sr-only">Remove</span>
            &times;
          </Button>
        </DropdownMenuItem>
      ))}
    </ScrollArea>
  );
};

export default SelectedUsersList;
