
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventLayer } from '../../context/calendarTypes';

interface UserSearchListProps {
  layerId: EventLayer;
  layerColor: string;
  getFilteredUsers: (layer: EventLayer) => { id: string; name: string }[];
  isUserSelected: (userId: string) => boolean;
  onUserToggle: (user: { id: string; name: string }, layer: EventLayer) => void;
  isLoading: boolean;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  layerId,
  layerColor,
  getFilteredUsers,
  isUserSelected,
  onUserToggle,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Ensure we have a valid array of users
  const users = Array.isArray(getFilteredUsers(layerId)) ? getFilteredUsers(layerId) : [];
  
  // Filter users based on search query
  const searchFilteredUsers = users.filter(user => 
    user.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );
  
  return (
    <>
      <div className="p-2">
        <Input
          placeholder={`Search ${layerId}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
          autoFocus
        />
      </div>
      <DropdownMenuSeparator />
      <ScrollArea className="h-[200px]">
        {isLoading ? (
          <DropdownMenuItem disabled>Loading {layerId}...</DropdownMenuItem>
        ) : searchFilteredUsers.length > 0 ? (
          searchFilteredUsers.map((user) => (
            <DropdownMenuItem
              key={user.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onUserToggle(user, layerId)}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-2 h-2 rounded-full ${layerColor}`} />
                <span>{user.name}</span>
              </div>
              {isUserSelected(user.id) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No users found</DropdownMenuItem>
        )}
      </ScrollArea>
    </>
  );
};

export default UserSearchList;
