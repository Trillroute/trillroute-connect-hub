
import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLayersDropdown } from './hooks/useLayersDropdown';
import LayerItem from './components/dropdown/LayerItem';
import SelectedUsersList from './components/dropdown/SelectedUsersList';

const LayersDropdown: React.FC = () => {
  const {
    layers,
    activeLayers,
    selectedUsers,
    loadingTeachers,
    loadingStudents,
    toggleLayer,
    toggleUser,
    getFilteredUsers,
    isUserSelected,
    handleUserToggle,
    getLevelColor,
    handleDropdownOpenChange,
  } = useLayersDropdown();

  return (
    <DropdownMenu onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
          <Layers className="h-4 w-4" />
          <span className="hidden md:inline">Layers</span>
          {selectedUsers.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
              {selectedUsers.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white" align="start">
        <DropdownMenuLabel>Event Layers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {layers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            isActive={activeLayers.includes(layer.id)}
            toggleLayer={toggleLayer}
            onUserToggle={handleUserToggle}
            loadingTeachers={loadingTeachers}
            loadingStudents={loadingStudents}
            getFilteredUsers={getFilteredUsers}
            isUserSelected={isUserSelected}
          />
        ))}
        
        {selectedUsers.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Selected Users ({selectedUsers.length})</DropdownMenuLabel>
            <SelectedUsersList 
              selectedUsers={selectedUsers}
              toggleUser={toggleUser}
              getLevelColor={getLevelColor}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LayersDropdown;
