
import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { EventLayer } from '../../context/calendarTypes';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import UserSearchList from './UserSearchList';

interface LayerItemProps {
  layer: {
    id: EventLayer;
    label: string;
    color: string;
    icon: React.ReactNode;
  };
  isActive: boolean;
  toggleLayer: (layer: EventLayer) => void;
  onUserToggle: (user: { id: string; name: string }, layer: EventLayer) => void;
  loadingTeachers: boolean;
  loadingStudents: boolean;
  getFilteredUsers: (layer: EventLayer) => { id: string; name: string }[];
  isUserSelected: (userId: string) => boolean;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isActive,
  toggleLayer,
  onUserToggle,
  loadingTeachers,
  loadingStudents,
  getFilteredUsers,
  isUserSelected
}) => {
  return (
    <DropdownMenuCheckboxItem
      checked={isActive}
      onCheckedChange={() => toggleLayer(layer.id)}
      className="flex items-center gap-2"
    >
      <div className={`w-3 h-3 rounded-full ${layer.color}`} />
      <span className="flex-1">{layer.label}</span>
      {isActive && (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="pl-0 py-0">
            <ChevronRight className="h-4 w-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56 bg-white">
            <UserSearchList
              layerId={layer.id}
              layerColor={layer.color}
              getFilteredUsers={getFilteredUsers}
              isUserSelected={isUserSelected}
              onUserToggle={onUserToggle}
              isLoading={layer.id === 'teachers' ? loadingTeachers : layer.id === 'students' ? loadingStudents : false}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}
    </DropdownMenuCheckboxItem>
  );
};

export default LayerItem;
